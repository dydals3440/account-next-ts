import { useInfiniteQuery } from 'react-query'

import { getTransaction } from '@remote/transaction'
import useUser from '@hooks/useUser'

// 기본 빈객체
function useTransactions({ suspense }: { suspense?: boolean } = {}) {
  const user = useUser()
  return useInfiniteQuery(
    ['transactions', user?.id],
    ({ pageParam }) =>
      getTransaction({ userId: user?.id as string, pageParam }),
    {
      getNextPageParam: (snapshot) => {
        return snapshot.lastVisible
      },
      suspense,
    },
  )
}

export default useTransactions
