import { getDoc, doc, collection } from 'firebase/firestore'

import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'
import { Event } from '@models/event'

export async function getEvent(id: string) {
  // 1. 컬렉션에 접근
  // collection(store, COLLECTIONS.EVENT)
  // 2. 이벤트 컬렉션에 아이디에 해당하는 문서를 가져옴
  // doc(collection(store, COLLECTIONS.EVENT), id)
  // 3. 실제 데이터를 가져옴
  const snapshot = await getDoc(doc(collection(store, COLLECTIONS.EVENT), id))
  //   4. 데이터를 밖으로 내보냄
  console.log(snapshot.data())
  return {
    id: snapshot.id,
    ...(snapshot.data() as Event),
  }
}
