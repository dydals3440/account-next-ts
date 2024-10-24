import dynamic from 'next/dynamic'
import withAuth from '@shared/hocs/withAuth'

const CategoryPieChart = dynamic(
  () => import('@components/account/CategoryPieChart'),
  { ssr: false },
)
const MonthlyChart = dynamic(() => import('@components/account/MonthlyChart'), {
  ssr: false,
})
const Transactions = dynamic(() => import('@components/account/Transactions'), {
  ssr: false,
})

function AccountPage() {
  return (
    <div>
      <MonthlyChart chartData={generateMonthlyChatData()} />
      <CategoryPieChart chartData={generatePieChartData()} />
      <Transactions />
    </div>
  )
}

function generatePieChartData() {
  return ['카페', '쇼핑', '여행', '커피'].map((label) => ({
    label,
    amount: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
  }))
}

function generateMonthlyChatData() {
  return [
    '2024-01-31',
    '2024-02-28',
    '2024-03-31',
    '2024-04-30',
    '2024-05-31',
    '2024-06-30',
    '2024-07-31',
    '2024-08-31',
    '2024-09-30',
    '2024-10-31',
    '2024-11-30',
    '2024-12-31',
  ].map((date) => ({
    date,
    // 10만 ~ 1만 사이의 랜덤한 값
    balance: Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000,
  }))
}

export default withAuth(AccountPage)
