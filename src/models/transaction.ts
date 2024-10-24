export type TransactionType = 'diposit' | 'withdraw'
export type TransactionFilterType = 'all' | TransactionType

export interface Transaction {
  userId: string
  type: TransactionType
  amount: number
  balance: number
  displayText: string
  date: string
}
