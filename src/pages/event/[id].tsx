import { GetServerSidePropsContext } from 'next'
import { getEvent } from '@remote/event'
import { Event } from '@models/event'
import Preview from '@components/event/Preview'
import { useQuery } from 'react-query'
import { isAfter, parseISO } from 'date-fns'
import { useAlertContext } from '@contexts/AlertContext'

interface EventPageProps {
  initialEvent: Event
  id: string
}
function EventPage({ initialEvent, id }: EventPageProps) {
  const { open } = useAlertContext()
  // 데이터를 못불러올 수 도 있으니 클라이언트측에서도 불러오도록 만들어줌.
  const { data } = useQuery(['event', id], () => getEvent(id), {
    initialData: initialEvent,
    onSuccess: (event) => {
      // 오늘 날짜가 endDate를 넘었는지?
      // event.endDate는 string이니 데이트 형식으로
      const 이벤트가종료되었는가 = isAfter(new Date(), parseISO(event.endDate))

      if (이벤트가종료되었는가) {
        open({
          title: `${event.title} 이벤트가 종료되었어요`,
          description: '다음에 더 좋은 이벤트로 찾아오겠습니다.',
          onButtonClick: () => {
            window.history.back()
          },
        })
      }
    },
  })

  // 데이터가 없을 떄 아무것도 그리지 않도록
  if (data == null) {
    return null
  }

  return <Preview data={data} mode="preview" />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { id } = context.query

  const event = await getEvent(id as string)

  console.log(event)

  return {
    props: { id, initialEvent: event },
  }
}

export default EventPage
