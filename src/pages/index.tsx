import dynamic from 'next/dynamic'
import { getSession, useSession } from 'next-auth/react'

import Account from '@components/home/Account'
import { BannerSkeleton } from '@components/home/EventBanners'
import { CreditScoreSkeleton } from '@components/home/CreditScore'
import Spacing from '@shared/Spacing'
import { CardListSkeleton } from '@components/home/CardList'
import { GetServerSidePropsContext } from 'next'
import { dehydrate, QueryClient } from 'react-query'
import { User } from '@models/user'
import { getAccount } from '@remote/account'

// lazy + suspense in react
const EventBanners = dynamic(() => import('@components/home/EventBanners'), {
  // loading: () => <div>Loading...</div>,
  loading: () => <BannerSkeleton />,
  // 해당 컴포넌트를 SSR 할껀지 말껀지, 유저에게 빨리보여줘야하는 데이터는 아님 Banner는
  ssr: false,
})

const CreditScore = dynamic(() => import('@components/home/CreditScore'), {
  ssr: false,
  loading: () => <CreditScoreSkeleton />,
})

const CardList = dynamic(() => import('@components/home/CardList'), {
  ssr: false,
  loading: () => <CardListSkeleton />,
})

export default function Home() {
  const { data } = useSession()
  console.log(data)

  return (
    <>
      <EventBanners />
      <Account />
      <Spacing size={8} backgroundColor="gray100" />
      <CreditScore />
      <Spacing size={8} backgroundColor="gray100" />
      <CardList />
    </>
  )
}

// SSR 단계에서 계좌 정보를 불러옴
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (session != null && session.user != null) {
    const client = new QueryClient()

    await client.prefetchQuery(['account', (session.user as User).id], () =>
      getAccount((session.user as User).id),
    )
    return {
      props: {
        dehydratedState: JSON.parse(JSON.stringify(dehydrate(client))),
      },
    }
  }

  return {
    props: {},
  }
}
