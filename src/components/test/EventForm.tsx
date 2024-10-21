import { ChangeEvent, useCallback, useState } from 'react'
import { collection, doc, setDoc } from 'firebase/firestore'

import { store } from '@remote/firebase'

import Flex from '@shared/Flex'
import Button from '@shared/Button'
import TextField from '@shared/TextField'
import { COLLECTIONS } from '@constants/collection'
import Preview from '@components/event/Preview'

function EventForm() {
  const [formValues, setFormValues] = useState({
    title: '',
    subTitle: '',
    contents: '',
    buttonLabel: '',
    link: '',
    endDate: '',
  })

  const handleFormValues = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [e.target.name]: e.target.value,
      }))
    },
    [],
  )

  const handleSubmit = async () => {
    await setDoc(doc(collection(store, COLLECTIONS.EVENT)), formValues)

    alert('이벤트 정보를 추가했습니다.')
  }

  const 제출이가능한상태인가 = Object.values(formValues).every(
    (value) => value !== '',
  )

  return (
    <Flex direction="column">
      <Flex>
        <Flex style={{ flex: 1 }} direction="column">
          <TextField
            name="title"
            label="이벤트 제목"
            value={formValues.title}
            onChange={handleFormValues}
          />
          <TextField
            name="subTitle"
            label="이벤트 부제목"
            value={formValues.subTitle}
            onChange={handleFormValues}
          />
          <textarea
            style={{ height: 400 }}
            name="contents"
            value={formValues.contents}
            onChange={handleFormValues}
          />
          <TextField
            name="buttonLabel"
            label="버튼명"
            value={formValues.buttonLabel}
            onChange={handleFormValues}
          />
          <TextField
            name="link"
            label="링크"
            value={formValues.link}
            onChange={handleFormValues}
          />
          <TextField
            name="endDate"
            label="종료 일자"
            value={formValues.endDate}
            onChange={handleFormValues}
          />
        </Flex>
        <Flex style={{ flex: 2 }}>
          <Preview data={formValues} mode="edit" />
        </Flex>
      </Flex>
      <Button onClick={handleSubmit} disabled={제출이가능한상태인가 === false}>
        저장하기
      </Button>
    </Flex>
  )
}

export default EventForm
