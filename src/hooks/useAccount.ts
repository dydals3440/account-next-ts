import { useQuery } from 'react-query'

import { getAccount } from '@remote/account'
import useUser from '@hooks/useUser'

function useAccount() {
  const user = useUser()

  return useQuery(['account', user?.id], () => getAccount(user?.id as string), {
    // 유저가 있을 떄 만 호출함
    enabled: user != null,
  })
}

export default useAccount
