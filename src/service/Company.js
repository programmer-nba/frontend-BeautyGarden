import axios from 'axios'

export const Company = {
    async getMyCompanies(){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/Company/getCompannyAll`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async getMyCompany(id){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/Company/getCompanyBy/${id}`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async getMySignatures(){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/signature/getSugnatureAlls`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async getMySignature(id){
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/signature/getSugnatureBy/${id}`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
    async deleteCompany(id){
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/Company/deleteCompany/${id}`,
            {
                headers: {
                    'auth-token': localStorage.getItem("ssgdToken")
                }
            })
            return response.data
        }
        catch (err) {
            console.error(err)
            return err
        }
    },
}