import * as products from './products'
import * as login from './auth'
import * as transactions from './transactions'
import * as withdraw from './withdraw'
import * as deposit from './deposit'
import * as incomeoutcome from './incomeoutcome'
import * as balance from './balance'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  sub?: string // userId
  unique_name?: string // userName
  password?: string // userPassword (custom)
  [key: string]: unknown
}

type UserData = {
  userId: string
  userName: string
  userPassword: string
}

class API {
  products: typeof products
  login: typeof login
  transactions: typeof transactions
  withdraw: typeof withdraw
  deposit: typeof deposit
  incomeoutcome: typeof incomeoutcome
  balance: typeof balance

  constructor() {
    this.products = products
    this.login = login
    this.transactions = transactions
    this.withdraw = withdraw
    this.deposit = deposit
    this.incomeoutcome = incomeoutcome
    this.balance = balance
  }

  getUserDataFromToken = (): UserData | null => {
    const token = localStorage.getItem('template-app-token')
    if (!token) {
      console.error('No JWT token found in localStorage (expected key: "template-app-token").')
      return null
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token)
      console.log('Decoded JWT:', decoded)

      // Use fallback keys and log if missing
      const userId = decoded.sub || decoded.nameid || ''
      const userName = decoded.unique_name || decoded.name || ''
      const userPassword = decoded.password || ''

      if (!userId || !userName || !userPassword) {
        console.warn('One or more fields missing. Found:', {
          userId,
          userName,
          userPassword,
        })
        return null
      }

      return {
        userId: userId.toString(),
        userName: userName.toString(),
        userPassword: userPassword.toString(),
      }
    } catch (error) {
      console.error('Failed to decode JWT token:', error)
      return null
    }
  }
}

const api = new API()
export default api