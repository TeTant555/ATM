import { useQuery, type UseQueryOptions } from "@tanstack/vue-query"
import axios from "axios";

export const InOutById = {
    useQuery: (userId: string, opt?: Partial<UseQueryOptions<IncomeOutcomeType, Error>>) => {
        return useQuery<IncomeOutcomeType, Error>({
            queryKey: ['incomeoutcome', userId],
            queryFn: async () => {
                console.log("UserId", userId)
                const response = await axios.get(`User/GetIncomeOutcomebyUserId`, {
                    params: { userId }
                });
                console.log("DATA",response.data.data)
                return response.data.data; // Adjust this based on actual response
            },
            ...opt
        })
    }
}