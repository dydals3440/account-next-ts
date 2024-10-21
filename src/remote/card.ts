import {
  collection,
  query,
  QuerySnapshot,
  limit,
  startAfter,
  getDocs,
  where,
} from 'firebase/firestore'
import { Card } from '@models/card'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'

export async function getCards(pageParam?: QuerySnapshot<Card>) {
  const cardQuery =
    pageParam == null
      ? query(collection(store, COLLECTIONS.CARD), limit(15)) // 처음에는 15개
      : query(
          collection(store, COLLECTIONS.CARD), // 해당 페이지 파람으로부터 15개를 불러옴.
          startAfter(pageParam),
          limit(15),
        )
  const cardSnapshot = await getDocs(cardQuery)
  // 카드 스냅샷의 문서중, 마지막 요소를 가져옴.
  const lastVisible = cardSnapshot.docs[cardSnapshot.docs.length - 1]

  const items = cardSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Card),
  }))

  return { items, lastVisible }
}

// firebase -> Rdb 처럼  like절이 없음
// 검색어들을 사전으로 정의해야하는데, 이렇게하면 일이 커짐
export async function getSearchCards(keyword: string) {
  const searchQuery = query(
    collection(store, COLLECTIONS.CARD),
    where('name', '>=', keyword),
    where('name', '<=', keyword + '\uf8ff'), // 유니코드는, 문자들 중에 가장 큰 값. 키워드로 시작하는, 모든 카드들을 찾음.
  )

  const cardSnapshot = await getDocs(searchQuery)

  return cardSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Card),
  }))
}
