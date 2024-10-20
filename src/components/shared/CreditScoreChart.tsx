import { useRef, useEffect, useState, memo } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

import { colors } from '@styles/colorPalette'
import Text from '@shared/Text'
import addDelimiter from '@utils/addDelimiter'

// 최대값 신용점수
const 신용점수_최대값 = 1_000

interface CreditScoreChartProps {
  width?: number
  height?: number
  score: number
}

function CreditScoreChart({
  score,
  width = 100,
  height = 100,
}: CreditScoreChartProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const [totalLength, setTotalLength] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      setTotalLength(pathRef.current.getTotalLength())
    }
  }, [])

  // 길이에 대한 상대적인 값을 구함
  const dashoffset = totalLength - (score / 신용점수_최대값) * totalLength

  return (
    <Container width={width} height={height}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 223 164"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 회색 배경 경로 */}
        <path
          // 자바스크립트에서, 전체 길이를 svg를 잴 수 있게해줌
          ref={pathRef}
          d="M18.421 154C12.3741 140.971 9 126.458 9 111.159C9 54.7382 54.8908 9 111.5 9C168.109 9 214 54.7382 214 111.159C214 126.458 210.626 140.971 204.579 154"
          stroke={colors.gray100}
          strokeWidth="18"
          strokeLinecap="round"
        ></path>
        {/* 파란색 경로 */}
        <path
          d="M18.421 154C12.3741 140.971 9 126.458 9 111.159C9 54.7382 54.8908 9 111.5 9C168.109 9 214 54.7382 214 111.159C214 126.458 210.626 140.971 204.579 154"
          // 그려지는 선
          stroke={colors.blue980}
          strokeWidth="18"
          strokeLinecap="round"
          // 전체 길이
          strokeDasharray={totalLength}
          // 움직일 길이
          strokeDashoffset={dashoffset}
        ></path>
      </svg>
      <Text bold css={textStyles} typography="t6">
        {addDelimiter(score)}
      </Text>
    </Container>
  )
}

const Container = styled.div<{ width: number; height: number }>(
  ({ width, height }) => ({
    position: 'relative',
    width,
    height,
  }),
)

const textStyles = css`
  position: absolute;
  bottom: 25%;
  //  중앙으로 끌어오기
  transform: translateX(-50%);
  left: 50%;
`

// 차트는 쉽게 바뀌지않음. memo 처리를함.
export default memo(CreditScoreChart)
