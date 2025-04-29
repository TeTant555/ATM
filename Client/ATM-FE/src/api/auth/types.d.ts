type LoginType = {
  token: string
  user: {
      userID: string
      userName: string
      password: string
      wallet: number
      isLocked: string
  }
}
  
type AddLoginType = {
  userName: string
  password: string
}
  
module.export = { AddLoginType, LoginType }