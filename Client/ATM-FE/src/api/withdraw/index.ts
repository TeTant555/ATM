import { useMutation, type UseMutationOptions } from "@tanstack/vue-query"
import axios from "axios";

export const Withdraw = {
    useMutation: (opt?: Partial<UseMutationOptions<WithdrawType, Error, AddForWithdraw>>) => {
        return useMutation<WithdrawType, Error, AddForWithdraw>({
            mutationFn: async (withdraw) => {
                const request = await axios.patch(`User/Withdraw`, withdraw);
                return request.data.data;
            },
            ...opt
        })
    }
}