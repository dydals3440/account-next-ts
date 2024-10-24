import { collection, doc, setDoc, getDoc } from 'firebase/firestore'

import { COLLECTIONS } from '@constants/collection'
import { store } from '@remote/firebase'
import { Account } from '@models/account'

export function setTerms({
  userId,
  termIds,
}: {
  userId: string
  termIds: string[]
}) {
  return setDoc(doc(collection(store, COLLECTIONS.TERMS), userId), {
    userId,
    termIds,
  })
}

export async function getTerms(userId: string) {
  const snapshot = await getDoc(
    doc(collection(store, COLLECTIONS.TERMS), userId),
  )

  if (snapshot.exists() === false) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as { userId: string; termIds: string[] }),
  }
}

export async function createAccount(newAccount: Account) {
  return await setDoc(
    doc(collection(store, COLLECTIONS.ACCOUNT), newAccount.userId),
    newAccount,
  )
}

// 유저 아이디를 기반으로, 통장을 찾는 함수.
export async function getAccount(userId: string) {
  const snapshot = await getDoc(
    doc(collection(store, COLLECTIONS.ACCOUNT), userId),
  )

  if (snapshot.exists() === false) {
    return null
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Account),
  }
}
