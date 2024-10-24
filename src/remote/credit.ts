import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

import { COLLECTIONS } from '@constants/collection'
import { store } from '@remote/firebase'
import { Credit } from '@models/credit'

export function updateCredit({
  userId,
  creditScore,
}: {
  userId: string
  creditScore: number
}) {
  // one user one credit score
  return setDoc(doc(collection(store, COLLECTIONS.CREDIT), userId), {
    userId,
    creditScore,
  })
}

export async function getCredit(userId: string) {
  const snapshot = await getDoc(
    doc(collection(store, COLLECTIONS.CREDIT), userId),
  )

  // 조회를 했는데, 만약에 문서가 없으면, 유저가 신용점수를 조회하지 않았다는 것.
  // 보여줄 신용점수가 없기에 null
  if (snapshot.exists() === false) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Credit),
  }
}
