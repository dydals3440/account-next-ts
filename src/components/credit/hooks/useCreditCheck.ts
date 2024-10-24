import { useQuery } from 'react-query'
import { CHECK_STATUS } from '@constants/credit'

interface useCreditCheckProps {
  onSuccess: (creditScore: number) => void
  onError: () => void
  enabled: boolean
}

export function useCreditCheck({
  onSuccess,
  onError,
  enabled,
}: useCreditCheckProps) {
  return useQuery(['useCreditCheck'], () => getCheckStatus(), {
    enabled,
    refetchInterval: 2_000,
    staleTime: 0,
    onSuccess: (status) => {
      console.log(status)
      // 조회성공 !
      if (status === CHECK_STATUS.COMPLETE) {
        onSuccess(getCreditScore(200, 1000))
      }
    },
    onError,
  })
}

function getCheckStatus() {
  const values = [
    CHECK_STATUS.READY,
    CHECK_STATUS.PROGRESS,
    CHECK_STATUS.COMPLETE,
    CHECK_STATUS.REJECT,
  ]

  const status = values[Math.floor(Math.random() * values.length)]

  // 랜덤하게 가져온 상태값이, 리젝이라면 에러 방출
  if (status === CHECK_STATUS.REJECT) {
    throw new Error('신용점수 조회에 실패했습니다.')
  }

  return status
}

// ex. 200 ~ 1000점 사이의 랜덤한 값을 유저의 신용점수로 할당.
function getCreditScore(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
