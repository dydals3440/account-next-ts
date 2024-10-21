import { QueryClient, dehydrate, useInfiniteQuery } from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'

import getCards from '@remote/card'
import ListRow from '@shared/ListRow'
import { useCallback } from 'react'
import Badge from '@shared/Badge'
import { useRouter } from 'next/router'

function CardListPage() {
  const router = useRouter()
  const {
    data,
    hasNextPage = false,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery(['cards'], ({ pageParam }) => getCards(pageParam), {
    getNextPageParam: (snapshot) => {
      return snapshot.lastVisible
    },
  })

  const loadMore = useCallback(() => {
    if (hasNextPage === false || isFetching) {
      return
    }
    fetchNextPage()
  }, [hasNextPage, fetchNextPage, isFetching])

  if (data == null) {
    return null
  }

  // 페이징을 하기에 data를 바로 못씀 플렛하게 펼쳐야함.
  const cards = data?.pages.map(({ items }) => items).flat()

  return (
    <div>
      <InfiniteScroll
        dataLength={cards.length}
        hasMore={hasNextPage}
        loader={<ListRow.Skeleton />}
        next={loadMore}
        scrollThreshold="100px"
      >
        <ul>
          {cards.map((card, index) => (
            <ListRow
              key={card.id}
              contents={
                <ListRow.Texts title={`${index + 1}위`} subTitle={card.name} />
              }
              right={
                card.payback != null ? <Badge label={card.payback} /> : null
              }
              withArrow={true}
              onClick={() => {
                router.push(`/card/${card.id}`)
              }}
            />
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

// SSR이 먼저 실행되고 _app 이 그려짐.
export async function getServerSideProps() {
  console.log('SSR')

  const client = new QueryClient()

  await client.prefetchInfiniteQuery(['cards'], () => getCards())

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(client))),
    },
  }
}

export default CardListPage
