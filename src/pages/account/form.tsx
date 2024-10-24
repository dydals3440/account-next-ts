import { useForm } from 'react-hook-form'

import { FORMS } from '@constants/account'
import TextField from '@shared/TextField'
import { Fragment, useCallback } from 'react'
import { AccountForm } from '@models/account'
import Spacing from '@shared/Spacing'
import Select from '@shared/Select'
import dynamic from 'next/dynamic'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
})

type FormData = {
  [key: string]: string
}

function Form({ onNext }: { onNext: (formValues: FormData) => void }) {
  const { register, formState, handleSubmit } = useForm<FormData>({
    mode: 'onBlur',
  })

  // FROM 2 dif types
  const component = useCallback(
    (form: AccountForm) => {
      if (form.type === 'TEXT_FIELD') {
        return (
          <TextField
            label={form.label}
            helpMessage={
              // 에러 메시지를 우선적으로 보여주게함.
              (formState.errors[form.id]?.message as string) || form.helpMessage
            }
            // 에러가 null이 아니면, 에러가 났다고 판단.
            hasError={formState.errors[form.id] != null}
            {...register(form.id, {
              required: form.required,
              pattern: VALIDATION_MESSAGE_MAP[form.id],
            })}
          />
        )
      } else if (form.type === 'SELECT') {
        return (
          <Select
            label={form.label}
            options={form.options}
            {...register(form.id, {
              required: form.required,
              pattern: VALIDATION_MESSAGE_MAP[form.id],
            })}
          />
        )
      }
    },
    [formState.errors, register],
  )

  return (
    <div style={{ padding: 24 }}>
      <form>
        {FORMS.map((form) => {
          return (
            <Fragment key={form.id}>
              {component(form)}
              <Spacing size={8} />
            </Fragment>
          )
        })}
      </form>
      <FixedBottomButton label="개설하기" onClick={handleSubmit(onNext)} />
    </div>
  )
}

const VALIDATION_MESSAGE_MAP: {
  [key: string]: {
    value: RegExp
    message: string
  }
} = {
  name: {
    value: /^[가-힣]+$/,
    message: '한글명을 확인해주세요',
  },
  email: {
    value: /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    message: '이메일 형식을 확인해주세요',
  },
  phone: {
    value: /^\d+$/,
    message: '휴대전화번호를 확인해주세요',
  },
}

export default Form
