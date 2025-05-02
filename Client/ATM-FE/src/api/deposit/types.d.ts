type DepositType = {
    message: string,
    status: number,
    data: {
        userName: string
        password: string
    }
}

type AddForDeposit = {
    amount: number
    id: string
    password?: string
}

module.export = { DepositType, AddForDeposit }