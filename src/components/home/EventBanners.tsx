import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'

import withSuspense from '@shared/hocs/withSuspense'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Skeleton from '@shared/Skeleton'

import useEventBanners from '@components/home/hooks/useEventBanners'
import { css } from '@emotion/react'
import Image from 'next/image'

function EventBanners() {
  const { data } = useEventBanners()

  return (
    <div style={{ padding: 24 }}>
      <Swiper spaceBetween={8}>
        {data?.map((banner) => {
          return (
            <SwiperSlide key={banner.id}>
              <Link href={banner.link}>
                <Flex
                  css={bannerStyles}
                  style={{ backgroundColor: banner.backgroundColor }}
                  justify="space-between"
                >
                  {/* LEFT */}
                  <Flex direction="column">
                    <Text bold>{banner.title}</Text>
                    <Text typography="t6">{banner.subTitle}</Text>
                  </Flex>
                  {/* RIGHT */}
                  <Image
                    src={banner.iconUrl}
                    width={40}
                    height={40}
                    alt="이미지"
                  />
                </Flex>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

const bannerStyles = css`
  padding: 24px;
  border-radius: 8px;
`

export function BannerSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      <Skeleton width="100%" height={100} style={{ borderRadius: 8 }} />
    </div>
  )
}

export default withSuspense(EventBanners, {
  fallback: <BannerSkeleton />,
})
