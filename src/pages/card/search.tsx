import Top from '@shared/Top'
import Input from '@shared/Input'

import { useRouter } from 'next/router'
import { useRef, useEffect, useState, useCallback, ChangeEvent } from 'react'
import { useQuery } from 'react-query'
import { getSearchCards } from '@remote/card'
import Text from '@shared/Text'
import ListRow from '@shared/ListRow'
import Badge from '@shared/Badge'

import useDebounce from '@shared/hooks/useDebounce'

function SearchPage() {
  // 키워드 관리 State
  const [keyword, setKeyword] = useState('')
  // keyword를 디바운스 처리
  const debouncedKeyword = useDebounce(keyword)

  console.log(debouncedKeyword)

  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)

  const { data: cards } = useQuery(
    ['cards', keyword],
    () => getSearchCards(keyword),
    {
      enabled: keyword !== '',
    },
  )

  // SearchPage가 mount되었을 떄
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }, [])

  return (
    <div>
      <Top title={'추천 카드'} subTitle={'회원님을 위해 준비했습니다.'} />
      <div style={{ padding: '0 24px 12px 24px' }}>
        <Input ref={inputRef} value={keyword} onChange={handleKeyword} />
      </div>
      {keyword !== '' && cards?.length === 0 ? (
        <div style={{ padding: 24 }}>
          <Text>{keyword} 검색어에 해당하는 카드가 없습니다.</Text>
        </div>
      ) : (
        <ul>
          {cards?.map((card, index) => (
            <ListRow
              key={card.id}
              contents={
                <ListRow.Texts title={`${index + 1}위`} subTitle={card.name} />
              }
              right={
                card.payback != null ? <Badge label={card.payback} /> : null
              }
              withArrow={true}
              onClick={() => {
                router.push(`/card/${card.id}`)
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchPage
