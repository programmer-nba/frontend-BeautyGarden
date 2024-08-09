import axios from 'axios'

export const Suppliers = {
    async getSuppliers(){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/supplier/getSupplierAll`,
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
    async getSupplier(id){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/supplier/getSupplierBy/${id}`,
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
    async deleteSupplier(ids){
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/supplier/deleteSupplier/${ids}`,
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
    async createNewSupplier(data){
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/supplier/create`, data,
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
    async editSupplier(id, data){
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/supplier/updateSupplier/${id}`, data,
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