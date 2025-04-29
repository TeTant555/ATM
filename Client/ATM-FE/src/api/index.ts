import * as products from './products';
import * as login from './auth'
import * as transactions from './transactions'
import * as withdraw from './withdraw'

class API {
	products: typeof products;
	login: typeof login;
	transactions: typeof transactions
	withdraw: typeof withdraw

	constructor() {
		this.products = products;
		this.login = login
		this.transactions = transactions
		this.withdraw = withdraw
	}
}

const api = new API();

export default api;