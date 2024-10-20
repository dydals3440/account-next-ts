import dynamic from 'next/dynamic'

import Account from '@components/home/Account'
import { BannerSkeleton } from '@components/home/EventBanners'

// lazy + suspense in react
const EventBanners = dynamic(() => import('@components/home/EventBanners'), {
  // loading: () => <div>Loading...</div>,
  loading: () => <BannerSkeleton />,
  // 해당 컴포넌트를 SSR 할껀지 말껀지, 유저에게 빨리보여줘야하는 데이터는 아님 Banner는
  ssr: false,
})

export default function Home() {
  return (
    <>
      <EventBanners />
      <Account />
    </>
  )
}
