<template>
    <div class="bg-green-400 flex flex-col items-center justify-center h-[80lvh] rounded-xl gap-y-5">
        <h1 class="text-center text-3xl">เข้าสู่ระบบ สวนสวยการ์เด้น</h1>
        <div class="flex flex-col items-center">
            <label for="username" class="text-start w-full">username</label>
            <input autofocus name="username" class="p-2 focus:outline-green-400" type="text" v-model="username" />
        </div>
        <div class="flex flex-col items-center">
            <label for="password" class="text-start w-full">password</label>
            <div class="relative w-fit">
                <input name="password" class="p-2 focus:outline-green-400" :type="seePassword ? 'text' : 'password'" v-model="password" @keydown="keyDownHandle" />
                <i @click="seePassword = !seePassword" class="absolute top-1/2 right-1 -translate-y-1/2" :class="seePassword ? 'pi pi-eye' : 'pi pi-eye-slash'"></i>
            </div>
            <small class="text-red-500 text-start w-full">{{errValid}}</small>
        </div>
        <Button id="submit-btn" :loading="loading" label="เข้าสู่ระบบ" class="font-bold px-2 py-1 bg-white text-green-700" @click="login" />
    </div>
</template>
<script setup>
import { useAuthStore } from "@/stores/auth"
import { ref } from 'vue'

const auth = useAuthStore()

const loading = ref(false)
const username = ref("")
const password = ref("")
const seePassword = ref(false)
const errValid = ref("")

const keyDownHandle = (e) => {
    const btn = document.getElementById('submit-btn')
    if (e.key === 'Enter') {
        //e.preventDefault()
        btn.focus()
    }
}

const login = async () => {
    loading.value = true
    const res =  await auth.login(username.value, password.value)
    if (res.data) {
        loading.value = false
        errValid.value = ""
        window.location.href = '/'
    } else {
        loading.value = false
        errValid.value = res.response.data.message
        console.log(res.response.data.message)
    }
}

</script>
<style scoped>
    
</style>