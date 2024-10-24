// 월별 데이터
// 날짜: 월별 마지막 일자
// 잔고: 월별 마지막 일자의 잔고

// 차트는, 매우 많이 먹음. 리소스를
import { memo, useMemo } from 'react'
import { Bar } from '@visx/shape'
import { Group } from '@visx/group'
import { scaleBand, scaleLinear } from '@visx/scale'

import { ParentSize } from '@visx/responsive'
import { colors } from '@styles/colorPalette'
import { AxisBottom } from '@visx/axis'
import { format, parseISO } from 'date-fns'

interface ChartData {
  // X축
  date: string
  // Y축
  balance: number
}

interface MonthlyChartProps {
  chartData: ChartData[]
  width: number
  height: number
}

const verticalMargin = 120

// accessors
const getX = (d: ChartData) => d.date
// Y축 데이터 결정
const getY = (d: ChartData) => d.balance

function MonthlyChart({ chartData, width, height }: MonthlyChartProps) {
  console.log(width)
  console.log(chartData, '차트데이터')

  // bounds
  const xMax = width
  const yMax = height - verticalMargin
  const formatDate = (date: string) => format(parseISO(date), 'M월')

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: chartData.map(getX),
        padding: 0.4,
      }),
    [xMax, chartData],
  )

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...chartData.map(getY))],
      }),
    [yMax, chartData],
  )

  return width < 10 ? null : (
    <svg width={width} height={height}>
      {/*<GradientTealBlue id="teal" />*/}
      <rect width={width} height={height} fill="url(#teal)" rx={14} />
      <Group top={verticalMargin / 2}>
        {chartData.map((d) => {
          const date = getX(d)
          const barWidth = xScale.bandwidth()
          const barHeight = yMax - (yScale(getY(d)) ?? 0)
          const barX = xScale(date)
          const barY = yMax - barHeight

          return (
            <Bar
              key={date}
              x={barX}
              y={barY}
              width={barWidth}
              height={barHeight}
              fill={colors.blue}
              onClick={() => {
                alert('click')
              }}
            />
          )
        })}
      </Group>
      <AxisBottom
        top={yMax + 60}
        scale={xScale}
        tickFormat={formatDate}
        stroke={colors.blue}
        tickStroke={colors.blue}
        tickLabelProps={{
          fill: colors.blue,
          fontSize: 12,
          textAnchor: 'middle',
        }}
      />
    </svg>
  )
}

interface ChartWrapperProps {
  height?: number
  chartData: ChartData[]
}

function ChartWrapper({ height = 200, chartData }: ChartWrapperProps) {
  // ViewPort 사이즈의 너비값을 내려줌.
  return (
    <ParentSize>
      {({ width }) => (
        <MonthlyChart width={width} height={height} chartData={chartData} />
      )}
    </ParentSize>
  )
}

export default memo(ChartWrapper)
