import { useQuery, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";

export const BalanceById = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<BalanceType, Error>>) => {
        return useQuery<BalanceType, Error>({
            queryKey: ['balancetype', userId],
            queryFn: async () => {
                console.log("UserId", userId)
                const response = await axios.get(`User/CheckBalance`, {
                    params: { userId }
                });
                console.log("Balance Data",response.data.data)
                return response.data; 
            },
            ...opt
        })
    }
}