type WithdrawType = {
    message: string,
    status: number,
    data: {
        userName: string
        password: string
    }
}

type AddForWithdraw = {
    amount: number
    id: string
    password?: string
}

module.export = { WithdrawType, AddForWithdraw }
