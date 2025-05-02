import * as products from './products';
import * as login from './auth'
import * as transactions from './transactions'
import * as withdraw from './withdraw'
import * as deposit from './deposit'
import * as incomeoutcome from './incomeoutcome'
import * as balance from './balance'

class API {
	products: typeof products;
	login: typeof login;
	transactions: typeof transactions
	withdraw: typeof withdraw
	deposit: typeof deposit
	incomeoutcome: typeof incomeoutcome
	balance: typeof balance

	constructor() {
		this.products = products;
		this.login = login
		this.transactions = transactions
		this.withdraw = withdraw
		this.deposit = deposit
		this.incomeoutcome = incomeoutcome
		this.balance = balance
	}
}

const api = new API();

export default api;