import { useMutation, type UseMutationOptions } from "@tanstack/vue-query"
import axios from "axios";

export const Deposit = {
    useMutation: (opt?: Partial<UseMutationOptions<DepositType, Error, AddForDeposit>>) => {
        return useMutation<DepositType, Error, AddForDeposit>({
            mutationFn: async (deposit) => {
                const request = await axios.patch(`User/Deposit`, deposit);
                return request.data.data;
            },
            ...opt
        })
    }
}