import dynamic from 'next/dynamic'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import Skeleton from '@shared/Skeleton'

// lazy + suspense in react
const EventBanners = dynamic(() => import('@components/home/EventBanners'), {
  // loading: () => <div>Loading...</div>,
  loading: () => (
    <Skeleton width="100%" height={100} style={{ borderRadius: 8 }} />
  ),
  // 해당 컴포넌트를 SSR 할껀지 말껀지, 유저에게 빨리보여줘야하는 데이터는 아님 Banner는
  ssr: false,
})

export default function Home() {
  return (
    <>
      <Container>
        <EventBanners />
        <h1 css={bold}>Hello</h1>
      </Container>
    </>
  )
}

const Container = styled.div`
  background-color: pink;
`

const bold = css`
  font-weight: bold;
`
