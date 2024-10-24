import withAuth from '@shared/hocs/withAuth'
import { useState } from 'react'
import ProgressBar from '@shared/ProgressBar'
import Terms from '@components/account/Terms'
import useUser from '@hooks/useUser'
import { getTerms, setTerms } from '@remote/account'
import { GetServerSidePropsContext } from 'next'
import { getSession } from 'next-auth/react'
import { User } from '@models/user'

// 마지막 페이지는 2
// STEP_0 = 약관동의
// STEP_1 = 계좌 개설 폼 페이지
// STEP_2 = 완료 페이지
const LAST_STEP = 2 // 완료 페이지

function AccountNew({ initialStep }: { initialStep: number }) {
  const [step, setStep] = useState(initialStep)
  const user = useUser()

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

  if (agreedTerms != null) {
    return {
      props: {
        initialStep: 1,
      },
    }
  }
  return {
    props: {
      initialStep: 0,
    },
  }
}

export default withAuth(AccountNew)
