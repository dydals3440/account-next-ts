import { useQuery } from 'react-query'
import { getEventBanners } from '@remote/banner'

import useAccount from '@hooks/useAccount'

function useEventBanners() {
  // TODO: user가 계좌를 보유하고 있는가?
  const { data: account } = useAccount()
  return useQuery(
    ['event-banners'],
    () =>
      getEventBanners({
        hasAccount: account != null && account.status === 'DONE',
      }),
    {
      // withSuspense HOC로 해결
      suspense: true,
    },
  )
}

export default useEventBanners
