import axios from 'axios'

export const Customers = {
    async getCustomers(){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/getCustomerAll`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            console.log(response.data)
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async getCustomer(id){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/customer/getCustomerBy/${id}`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            console.log(response.data)
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async deleteCustomer(id){
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/customer/deleteCustomer/${id}`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            console.log(response.data)
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async createNewCustomer(data){
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/customer/create`, data,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            console.log(response.data)
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async editCustomer(id, data){
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/customer/EditCustomer/${id}`, data,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            console.log(response.data)
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
}