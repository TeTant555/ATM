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
/* type TransDataType = {
  message: string,
  status: number,
  data: [
    {
      transactionID: string,
      userID: string,
      amount: number,
      transactionDate: string,
      transactionType: string
    },
  ]
} */

module.export = { TransactionType, AddUserId }
