import { useState, MouseEvent } from 'react'

import { 약관목록 } from '@constants/account'
import { Term } from '@models/account'
import Agreement from '@shared/Agreement'
import dynamic from 'next/dynamic'

const FixedBottomButton = dynamic(() => import('@shared/FixedBottomButton'), {
  ssr: false,
})

function Terms({ onNext }: { onNext: (termIds: string[]) => void }) {
  const [termsAgreement, setTermsAgreement] = useState(() =>
    generateInitialValue(약관목록),
  )
  console.log(termsAgreement)

  const handleAgreement = (id: string, checked: boolean) => {
    console.log('id', id)
    console.log('checked', checked)
    setTermsAgreement((prevTerms) => {
      return prevTerms.map((term) =>
        term.id === id ? { ...term, checked } : term,
      )
    })
  }

  const handleAllAgreement = (_: MouseEvent<HTMLElement>, checked: boolean) => {
    setTermsAgreement((prevTerms) => {
      return prevTerms.map((term) => ({ ...term, checked }))
    })
  }

  const 모든약관이_동의되었는가 = termsAgreement.every((term) => term.checked)
  const 모든필수약관이_동의되었는가 = termsAgreement
    .filter((term) => term.mandatory)
    .every((term) => term.checked)

  return (
    <div>
      <Agreement>
        <Agreement.Title
          checked={모든약관이_동의되었는가}
          onChange={handleAllAgreement}
        >
          약관 모두 동의
        </Agreement.Title>
        {termsAgreement.map((term, idx) => (
          <Agreement.Description
            key={term.id}
            link={term.link}
            checked={term.checked}
            onChange={(_, checked) => handleAgreement(term.id, checked)}
          >
            {term.mandatory ? '[필수]' : '[선택]'} {term.title}
          </Agreement.Description>
        ))}
      </Agreement>
      <FixedBottomButton
        label={'약관동의'}
        disabled={모든필수약관이_동의되었는가 === false}
        onClick={() => {
          onNext(
            termsAgreement.filter((term) => term.checked).map(({ id }) => id),
          )
        }}
      />
    </div>
  )
}

function generateInitialValue(terms: Term[]) {
  return terms.map((term) => ({ ...term, checked: false }))
}

export default Terms
