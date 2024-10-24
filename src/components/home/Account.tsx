import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Button from '@shared/Button'
import Spacing from '@shared/Spacing'
import Image from 'next/image'

import useAccount from '@hooks/useAccount'
import useUser from '@hooks/useUser'
import addDelimiter from '@utils/addDelimiter'
import Link from 'next/link'

function Account() {
  const { data: account } = useAccount()
  const user = useUser()

  // 계좌를 보유중이지 않을 떄
  if (account == null) {
    return (
      <div style={{ padding: 24 }}>
        <Flex justify="space-between">
          <Flex direction="column">
            {/* pre-wrap -> 제대로 줄바꿈 됨 */}
            <Text bold style={{ whiteSpace: 'pre-wrap' }}>
              {`계좌 개설이\n더 쉽고 빨라졌어요.`}
            </Text>
            <Spacing size={8} />
            <Link href="/account/new">
              <Button>3분만에 개설하기</Button>
            </Link>
          </Flex>
          <Image
            alt=""
            width={80}
            height={80}
            src="https://cdn2.iconfinder.com/data/icons/scenarium-vol-3-1/128/002_money_cash_gold_wealth_income_deposit_finance-128.png"
          />
        </Flex>
      </div>
    )
  }
  // tlatkwnd
  if (account.status === 'READY') {
    return (
      <div style={{ padding: 24 }}>
        <Flex justify="space-between">
          <Flex direction="column">
            {/* pre-wrap -> 제대로 줄바꿈 됨 */}
            <Text bold style={{ whiteSpace: 'pre-wrap' }}>
              계좌개설 심사중입니다.
            </Text>
          </Flex>
          <Image
            alt=""
            width={80}
            height={80}
            src="https://cdn2.iconfinder.com/data/icons/scenarium-vol-3-1/128/002_money_cash_gold_wealth_income_deposit_finance-128.png"
          />
        </Flex>
      </div>
    )
  }

  // 계좌 개설 완료 유저
  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between" align="center">
        <Flex direction="column">
          <Text typography="t6" color="gray600">
            {user?.name} 회원님의 자신
          </Text>
          <Spacing size={2} />
          <Text typography="t3" bold>
            {addDelimiter(account.balance)}원
          </Text>
        </Flex>
        <Button>분석</Button>
      </Flex>
    </div>
  )
}

export default Account
