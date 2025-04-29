import { useMutation, type UseMutationOptions } from "@tanstack/vue-query"
import axios from "axios";

export const addLogin = {
    useMutation: (opt?: Partial<UseMutationOptions<LoginType, Error, AddLoginType>>) => {
        return useMutation<LoginType, Error, AddLoginType>({
            mutationFn: async (login) => {
                const request = await axios.post(`Login/Login`, login);
                return request.data.data;
            },
            ...opt
        })
    }
}