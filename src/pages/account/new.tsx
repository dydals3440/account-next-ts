import withAuth from '@shared/hocs/withAuth'
import { useState } from 'react'
import ProgressBar from '@shared/ProgressBar'
import Terms from '@components/account/Terms'
import useUser from '@hooks/useUser'
import { createAccount, getAccount, getTerms, setTerms } from '@remote/account'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { User } from '@models/user'
import Form from '@pages/account/form'
import { Account } from '@models/account'
import FullPageLoader from '@shared/FullPageLoader'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const FixedBottomButton = dynamic(
  () => import('@/components/shared/FixedBottomButton'),
  { ssr: false },
)

// 마지막 페이지는 2
// STEP_0 = 약관동의
// STEP_1 = 계좌 개설 폼 페이지
// STEP_2 = 완료 페이지
const LAST_STEP = 2 // 완료 페이지

function AccountNew({ initialStep }: { initialStep: number }) {
  const [step, setStep] = useState(initialStep)
  const user = useUser()
  const router = useRouter()

  console.log(initialStep)

  return (
    <div>
      <ProgressBar progress={step / LAST_STEP} />
      {step === 0 ? (
        <Terms
          onNext={async (termIds) => {
            await setTerms({ userId: user?.id as string, termIds })

            setStep(step + 1)
          }}
        />
      ) : null}
      {step === 1 && (
        <Form
          onNext={async (formValues) => {
            console.log('formValues', formValues)

            const newAccount = {
              ...formValues,
              accountNumber: Date.now(),
              balance: 0,
              status: 'READY',
              userId: user?.id as string,
            } as Account

            await createAccount(newAccount)

            setStep(step + 1)
          }}
        />
      )}

      {step === 2 && (
        <>
          <FullPageLoader message={'계좌 개설 신청이 완료되었습니다'} />
          <FixedBottomButton
            label="확인"
            onClick={() => {
              router.push('/')
            }}
          />
        </>
      )}
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)
  const agreedTerms = await getTerms((session?.user as User).id)

  if (agreedTerms == null) {
    return {
      props: {
        initialStep: 0,
      },
    }
  }

  const account = await getAccount((session?.user as User).id)

  if (account == null) {
    return {
      props: {
        initialStep: 1,
      },
    }
  }

  return {
    props: {
      initialStep: 2,
    },
  }
}

export default withAuth(AccountNew)
