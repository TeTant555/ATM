type TransactionType = {
  transactionID: string
  userID: string
  amount: number
  transactionDate: string
  transactionType: string
}
type TransResponse = {
  message: String 
  status: number
  data: TransactionType[]
}

module.export = { TransactionType, AddUserId }
