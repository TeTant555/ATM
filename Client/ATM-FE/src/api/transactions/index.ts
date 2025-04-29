import { useQuery, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";

export const getById = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<TransactionType[], Error>>) => {
        return useQuery<TransactionType[], Error>({
            queryKey: ['transactions', userId],
            queryFn: async () => {
                console.log("UserId", userId)
                const response = await axios.get(`User/GetTransactionByUserId`, {
                    params: { userId }
                });
                return response.data.data; // Adjust this based on actual response
            },
            ...opt
        })
    }
}