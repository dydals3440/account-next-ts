import withAuth from '@shared/hocs/withAuth'
import { format } from 'date-fns'

import TextField from '@shared/TextField'
import Flex from '@shared/Flex'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Piggybank } from '@models/piggybank'
import useUser from '@hooks/useUser'
import { useMutation } from 'react-query'
import { createPiggybank } from '@remote/piggybank'
import { useAlertContext } from '@contexts/AlertContext'

const FixedBottomButton = dynamic(
  () => import('@/components/shared/FixedBottomButton'),
  {
    ssr: false,
  },
)

function PiggybankNewPage() {
  const [formValues, setFormValues] = useState({
    name: '',
    endDate: '',
    goalAmount: '',
  })
  const user = useUser()
  const { open } = useAlertContext()

  const { mutate, isLoading } = useMutation(
    (newPiggybank: Piggybank) => createPiggybank(newPiggybank),
    {
      onSuccess: () => {
        open({
          title: '새로운 저금통을 만들었어요.',
          onButtonClick: () => {
            window.history.back()
          },
        })
      },
      onError: () => {
        open({
          title: '저금통을 만들지 못했어요.',
          description: '잠시 후 다시 시도해주세요.',
          onButtonClick: () => {
            window.history.back()
          },
        })
      },
    },
  )

  const handleFormValues = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [e.target.name]: e.target.value,
    }))
  }, [])

  const handleSubmit = () => {
    const newPiggyBank = {
      ...formValues,
      goalAmount: Number(formValues.goalAmount),
      userId: user?.id as string,
      startDate: new Date(),
      endDate: new Date(formValues.endDate),
      balance: 0,
    } as Piggybank

    mutate(newPiggyBank)
  }

  // 계속 바뀌는 값이 아니니 useMemo
  const minDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])

  return (
    <div>
      <Flex direction="column">
        <TextField
          name="name"
          label="통장이름"
          value={formValues.name}
          onChange={handleFormValues}
        />
        <TextField
          name="endDate"
          type="date"
          label="종료일자"
          min={minDate}
          value={formValues.endDate}
          onChange={handleFormValues}
        />
        <TextField
          name="goalAmount"
          type="number"
          label="목표금액"
          value={formValues.goalAmount}
          onChange={handleFormValues}
        />
      </Flex>
      <FixedBottomButton
        disabled={isLoading === true}
        label="저금통 생성하기"
        onClick={handleSubmit}
      />
    </div>
  )
}

export default withAuth(PiggybankNewPage)
