import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    const token = ref()

    const login = async (username, password) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/login`,
                {
                    username: username,
                    password: password
                }
            )
            if (response.data.status) {
                token.value = response.data.token
                localStorage.setItem('ssgdToken', token.value)
                console.log(token.value)
            }
            return response
        }
        catch (err) {
            console.log(err)
            return err
        }
    }
    
    return { login, token }
})