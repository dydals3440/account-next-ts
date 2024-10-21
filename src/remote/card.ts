import {
  collection,
  query,
  QuerySnapshot,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore'
import { Card } from '@models/card'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'

async function getCards(pageParam?: QuerySnapshot<Card>) {
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

export default getCards
