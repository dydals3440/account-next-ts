import withAuth from '@shared/hocs/withAuth'
import { getSession } from 'next-auth/react'
import { dehydrate, QueryClient } from 'react-query'
import { User } from '@models/user'
import { GetServerSidePropsContext } from 'next'
import { getTransaction } from '@remote/transaction'
import useTransactions from '@components/account/hooks/useTransactions'
import { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import ListRow from '@shared/ListRow'
import { format, parseISO } from 'date-fns'
import Flex from '@shared/Flex'
import addDelimiter from '@utils/addDelimiter'
import Text from '@shared/Text'
import { TransactionFilterType } from '@models/transaction'

const FILTERS: Array<{ label: string; value: TransactionFilterType }> = [
  {
    label: '전체',
    value: 'all',
  },
  {
    label: '입금',
    value: 'amount',
  },
  {
    label: '출금',
    value: 'withdraw',
  },
]

function TransactionsPage() {
  const [currentFilter, setCurrentFilter] =
    useState<TransactionFilterType>('all')

  const {
    data,
    hasNextPage = false,
    isFetching,
    fetchNextPage,
  } = useTransactions({ filter: currentFilter })

  const loadMore = useCallback(() => {
    // 다음페이지가 없거나, 호출중이라면 아무런 동작 X
    if (hasNextPage === false || isFetching) {
      return
    }
    fetchNextPage()
  }, [hasNextPage, fetchNextPage, isFetching])

  const transactions = data?.pages.map(({ items }) => items).flat() ?? []

  return (
    <div>
      <Flex as="ul" justify="flex-end" style={{ padding: 24 }}>
        {FILTERS.map((filter) => (
          <li
            key={filter.value}
            onClick={() => {
              setCurrentFilter(filter.value)
            }}
          >
            {filter.label}
          </li>
        ))}
      </Flex>
      <InfiniteScroll
        dataLength={transactions.length}
        hasMore={hasNextPage}
        loader={<></>}
        next={loadMore}
        scrollThreshold="100px"
      >
        <ul>
          {transactions.map((transaction, index) => {
            const 입금 = transaction.type === 'diposit'
            return (
              <ListRow
                key={transaction.id}
                contents={
                  <ListRow.Texts
                    title={transaction.displayText}
                    subTitle={format(
                      parseISO(transaction.date),
                      'yyyy-MM-dd HH:mm:ss',
                    )}
                  />
                }
                right={
                  <Flex direction="column" align="flex-end">
                    <Text color={입금 ? 'blue' : 'red'}>
                      {입금 ? '+' : '-'} {addDelimiter(transaction.amount)}원
                    </Text>
                    <Text>{addDelimiter(transaction.balance)}원</Text>
                  </Flex>
                }
              />
            )
          })}
        </ul>
      </InfiniteScroll>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context)

  if (session != null && session.user != null) {
    const client = new QueryClient()

    await client.prefetchInfiniteQuery(
      ['transactions', (session.user as User)?.id, 'all'],
      () => getTransaction({ userId: (session.user as User)?.id as string }),
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

export default withAuth(TransactionsPage)
