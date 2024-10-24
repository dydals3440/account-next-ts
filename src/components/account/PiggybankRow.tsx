import ListRow from '@shared/ListRow'
import Image from 'next/image'
import { useRouter } from 'next/router'
import withSuspense from '@shared/hocs/withSuspense'
import useUser from '@hooks/useUser'
import { useQuery } from 'react-query'
import { getPiggybank } from '@remote/piggybank'
import { differenceInDays } from 'date-fns'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
import addDelimiter from '@utils/addDelimiter'

function PiggybankRow() {
  const router = useRouter()
  const user = useUser()

  const { data } = useQuery(
    ['piggybank', user?.id],
    () => getPiggybank(user?.id as string),
    {
      suspense: true,
    },
  )

  console.log(data, 'hi')

  // 생성된 저금통 X
  if (data == null) {
    return (
      <div>
        <ul>
          <ListRow
            left={
              <Image
                src="https://cdn2.iconfinder.com/data/icons/new-year-resolutions/64/resolutions-24-512.png"
                width={40}
                height={40}
                alt=""
              />
            }
            contents={
              <ListRow.Texts
                title="저금통"
                subTitle="매일 매일 조금씩 저금하여 목표금액을 모아보아요"
              />
            }
            withArrow
            onClick={() => router.push('/account/piggybank/new')}
          />
        </ul>
      </div>
    )
  }

  const { balance, endDate, goalAmount } = data
  const dday = differenceInDays(endDate, new Date())

  return (
    <div>
      <ul>
        <ListRow
          left={
            <Image
              src="https://cdn2.iconfinder.com/data/icons/new-year-resolutions/64/resolutions-24-512.png"
              width={40}
              height={40}
              alt=""
            />
          }
          contents={
            <Flex direction="column">
              <Text typography="t4" bold>
                D-{dday}
              </Text>
              <Text>{addDelimiter(goalAmount - balance)}원 남았어요</Text>
            </Flex>
          }
          withArrow
          onClick={() => router.push('/account/piggybank/new')}
        />
      </ul>
    </div>
  )
}

export default withSuspense(PiggybankRow, {
  fallback: <div>Loading 중 ...</div>,
})
