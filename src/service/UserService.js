import axios from 'axios'

const createUser = async (payload) => {
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/member/createMember`, payload,
            {
                headers: {
                    'auth-token' : localStorage.getItem('ssgdToken')
                }
            }
        )
        console.log(data)
        if (!data.status) return
        return data.data
    }
    catch (err) {
        console.log(err)
        return
    }
}

const updateUser = async (id, payload) => {
    try {
        const { data } = await axios.put(
            `${import.meta.env.VITE_API_URL}/member/EditMember/${id}`, payload,
            {
                headers: {
                    'auth-token' : localStorage.getItem('ssgdToken')
                }
            }
        )
        console.log(data.status)
        if (!data.status)  return null
        return data
    }
    catch (err) {
        console.log(err)
        return
    }
}

const getUsers = async () => {
    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/member/getMemberAll`,
            {
                headers: {
                    'auth-token' : localStorage.getItem('ssgdToken')
                }
            }
        )
        console.log(data)
        if (!data.status) return
        return data.data
    }
    catch (err) {
        console.log(err)
        return
    }
}

const getUser = async (id) => {
    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/member/getMemberBy/${id}`,
            {
                headers: {
                    'auth-token' : localStorage.getItem('ssgdToken')
                }
            }
        )
        console.log(data)
        if (!data.status) return
        return data.data
    }
    catch (err) {
        console.log(err)
        return
    }
}

const deleteUser = async (id) => {
    try {
        const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/member/deleteMember/${id}`,
            {
                headers: {
                    'auth-token' : localStorage.getItem('ssgdToken')
                }
            }
        )
        if (!data.status) return null
        return true
    }
    catch (err) {
        console.log(err)
        return
    }
}

export { getUsers, createUser, deleteUser, updateUser, getUser }