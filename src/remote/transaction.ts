import {
  Transaction,
  TransactionFilterType,
  TransactionType,
} from '@models/transaction'
import {
  collection,
  doc,
  query,
  QuerySnapshot,
  setDoc,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from 'firebase/firestore'
import { store } from '@remote/firebase'
import { COLLECTIONS } from '@constants/collection'

export function createTransaction(newTransaction: Transaction) {
  return setDoc(doc(collection(store, COLLECTIONS.TRANSACTION)), newTransaction)
}

export async function getTransaction({
  pageParam,
  userId,
  filter = 'all',
}: {
  userId: string
  pageParam?: QuerySnapshot<TransactionType>
  filter?: TransactionFilterType
}) {
  const transactionQuery = generateQuery({ filter, pageParam, userId })

  const transactionSnapshot = await getDocs(transactionQuery)
  const lastVisible =
    transactionSnapshot.docs[transactionSnapshot.docs.length - 1]

  const items = transactionSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Transaction),
  }))

  return { items, lastVisible }
}

// 필터는 복잡
function generateQuery({
  filter,
  pageParam,
  userId,
}: {
  filter: TransactionFilterType
  pageParam?: QuerySnapshot<TransactionType>
  userId: string
}) {
  const baseQuery = query(
    collection(store, COLLECTIONS.TRANSACTION),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    limit(15),
  )

  if (filter !== 'all') {
    if (pageParam == null) {
      return query(baseQuery, where('type', '==', filter))
    }
    return query(baseQuery, startAfter(pageParam), where('type', '==', filter))
  } else {
    if (pageParam == null) {
      return baseQuery
    }

    return query(baseQuery, startAfter(pageParam))
  }
}
