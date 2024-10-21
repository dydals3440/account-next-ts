import { GetServerSidePropsContext } from 'next'
import { useQuery } from 'react-query'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

import { getCard } from '@remote/card'
import { Card } from '@models/card'
import Top from '@shared/Top'
import ListRow from '@shared/ListRow'
import Image from 'next/image'
import Flex from '@shared/Flex'
import Text from '@shared/Text'
// import FixedBottomButton from '@shared/FixedBottomButton'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
})

interface CardDetailPageProps {
  initialCard: Card
}

function CardDetailPage({ initialCard }: CardDetailPageProps) {
  const { id } = useParams()

  // initialData를 활용해서, 최초의 값이 온전히 넘어오면 데이터 호출을 하지 않게 됨. (SSR로 부터)
  // 처음부터 data가 비워있지 않음, 그냥 쿼리면 undefined 였음.
  // 서버에서 데이터를불렀고, 이 불러온 데이터를 useQuery의 initialData를 넣어주었기에.
  const { data } = useQuery(['card'], () => getCard(id as string), {
    initialData: initialCard,
  })

  if (data == null) {
    return
  }

  const { name, corpName, payback, benefit, tags, promotion } = data

  const subTitle =
    promotion != null ? removeHtmlTags(promotion.title) : tags.join('')

  return (
    <div>
      <Top title={`${corpName} ${name}`} subTitle={subTitle} />
      <ul>
        {benefit.map((text, index) => (
          <motion.li
            key={text}
            initial={{ opacity: 0, translateX: -90 }}
            transition={{
              duration: 0.7,
              ease: 'easeInOut',
              delay: index * 0.7,
            }}
            animate={{
              opacity: 1,
              translateX: 0,
            }}
          >
            <ListRow
              as="div"
              left={
                <Image
                  src="https://cdn4.iconfinder.com/data/icons/travello-basic-ui-1/64/Correct-512.png"
                  width={40}
                  height={40}
                  alt=""
                />
              }
              contents={
                <ListRow.Texts title={`혜택 ${index + 1}`} subTitle={text} />
              }
            />
          </motion.li>
        ))}
      </ul>

      {promotion != null ? (
        <Flex
          direction="column"
          style={{ marginTop: '80px', padding: '0 24px 80px 24px' }}
        >
          <Text bold={true}>유의사항</Text>
          <Text typography="t7">{removeHtmlTags(promotion.terms)}</Text>
        </Flex>
      ) : null}

      <FixedBottomButton
        label="1분만에 신청하고 혜택받기"
        onClick={() => {
          // TODO:
        }}
      />
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context
  const cardId = query.id as string

  const card = await getCard(cardId)

  return {
    props: {
      initialCard: card,
    },
  }
}

function removeHtmlTags(text: string) {
  return text?.replace(/<\/?[^>]+(>|$)/g, '')
}

export default CardDetailPage
