import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'

import Account from '@components/home/Account'
import { BannerSkeleton } from '@components/home/EventBanners'
import { CreditScoreSkeleton } from '@components/home/CreditScore'
import Spacing from '@shared/Spacing'
import { CardListSkeleton } from '@components/home/CardList'

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
