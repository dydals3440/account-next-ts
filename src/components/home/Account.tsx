import Flex from '@shared/Flex'
import Text from '@shared/Text'
import Button from '@shared/Button'
import Spacing from '@shared/Spacing'
import Image from 'next/image'

function Account() {
  const hasAccount = false

  if (hasAccount) {
    return (
      <div style={{ padding: 24 }}>
        <Flex justify="space-between" align="center">
          <Flex direction="column">
            <Text typography="t6" color="gray600">
              매튜 회원님의 자신
            </Text>
            <Spacing size={2} />
            <Text typography="t3" bold>
              7,000원
            </Text>
          </Flex>
          <Button>분석</Button>
        </Flex>
      </div>
    )
  }

  // 계좌를 보유하고 있지 않을 떄
  // 계좌를 개설중일수도 있음.
  // READY | DONE
  const 계좌개설상태 = 'READY'
  const title =
    계좌개설상태 === 'READY'
      ? '만들고 있으신\n계좌가 있으시군요'
      : '계좌 개설이\n더 쉽고 빨라졌어요'
  const buttonLabel =
    계좌개설상태 === 'READY' ? '이어만들기' : '3분만에 개설하기'
  return (
    <div style={{ padding: 24 }}>
      <Flex justify="space-between">
        <Flex direction="column">
          {/* pre-wrap -> 제대로 줄바꿈 됨 */}
          <Text bold style={{ whiteSpace: 'pre-wrap' }}>
            {title}
          </Text>
          <Spacing size={8} />
          <Button>{buttonLabel}</Button>
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

export default Account
