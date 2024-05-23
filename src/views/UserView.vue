<template>
    <header>
      <div class="mb-10">
        <AdminNavBar />
      </div>
    </header>
    <div class="bg-white p-3">
      <div class="flex items-center">
        <Button label="เพิ่มผู้ดูเลลูกค้า" class="bg-sky-300 px-2 py-1" @click="openCreateUserModal"/>
        <Button icon="pi pi-refresh" @click="fetchUsers"/>
      </div>
  
      <div v-if="loading">Loading...</div>

      <div v-if="openUser" class="border my-3">
        <form @submit.prevent="onEdit ? editUser() : createNewUser()">
          <div class="flex items-center justify-between w-full px-2">
            <input v-model="user.member_username" placeholder="username" type="string" required class="px-2 py-1 border rounded w-full" />
            <input v-model="user.member_password" placeholder="password" type="password" required class="px-2 py-1 border rounded w-full" />
          </div>
          <div class="flex justify-center gap-x-3">
            <button @click="closeUserModal">ยกเลิก</button>
            <button class="font-bold bg-green-300 rounded px-2" type="submit">{{ onEdit ? 'อัพเดท' : 'สร้าง' }}</button>
          </div>
        </form>
      </div>
  
      <ul v-if="!loading" class="w-full border">
        <li v-for="(user, index) in users" :key="user._id" class="flex justify-between items-center w-full">
          <p class="px-2">{{ index + 1 }}</p>
          <p class="font-bold px-5 bg-yellow-300">{{ user.member_username }}</p>
          <button @click="openEditUserModal(user)">แก้ไข</button>
          <button class="text-red-500 px-2" @click="confirmDeleteUser(user._id)">ลบ</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getUsers, createUser, deleteUser, updateUser, getUser } from '@/service/UserService'
  import AdminNavBar from '@/components/NavBar/AdminNavBar.vue';
  
  const loading = ref(false)
  const users = ref([])
  const user = ref({})
  const openUser = ref(false)
  const onEdit = ref(false)
  
  const fetchUsers = async () => {
    loading.value = true
    try {
      const response = await getUsers()
      if (!response) return
      users.value = response
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }
  
  const createNewUser = async () => {
    loading.value = true
    const payload = user.value
    try {
      const response = await createUser(payload)
      if (!response) return
      openUser.value = false
      user.value = {}
      fetchUsers()
    } catch (err) {
      alert('Failed to create user')
      console.log(err)
    } finally {
      loading.value = false
    }
  }
  
  const editUser = async () => {
    loading.value = true
    const payload = user.value
    try {
      const response = await updateUser(user.value._id, payload)
      console.log(response)
      if (!response) {
          console.log('No response received or operation failed')
          return
      }
      openUser.value = false
      user.value = {}
      onEdit.value = false
      fetchUsers()
    } catch (err) {
      alert('Failed to update user')
      console.log(err)
    } finally {
      loading.value = false
    }
  }
  
  const openCreateUserModal = () => {
    user.value = {}
    openUser.value = true
    onEdit.value = false
  }
  
  const openEditUserModal = (userData) => {
    user.value = { ...userData }
    openUser.value = true
    onEdit.value = true
  }
  
  const closeUserModal = () => {
    openUser.value = false
    user.value = {}
    onEdit.value = false
  }
  
  const confirmDeleteUser = async (userId) => {
    const confirm = window.confirm('Are you sure you want to delete this user?')
    if (confirm) {
      deletingUser(userId)
    }
  }
  
  const deletingUser = async (userId) => {
    loading.value = true
    try {
      const response = await deleteUser(userId)
      if (!response) return
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
      console.log(err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchUsers)
  </script>
  
  <style scoped>
  button {
    margin: 5px;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  input {
    margin: 5px 0;
  }
  </style>
  