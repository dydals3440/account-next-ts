import { useEffect, useState } from 'react'

/**
 * @param value 사용할 값
 * @param delay 지연시간 (기본)
 */

function useDebounce<T = any>(value: T, delay = 800) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // timeout의 역할은, delay 시간만큼 지연을 했다가, 실행하게 함.
    const timeout = setTimeout(() => {
      // delay 시간이 지난후에 state를 업데이트
      setDebouncedValue(value)
    }, delay)

    // 만약, 이 함수가 실행되기 전에, 밖에서 변화가 일어나면 return 을 활용하여, 타임아웃 클리어
    // 맨 마지막 Action만 캐치
    return () => {
      clearTimeout(timeout)
    }
  }, [delay, value])

  return debouncedValue
}

export default useDebounce
