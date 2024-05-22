<template>
    <div>
      <button @click="fetchUsers">Load Users</button>
      <button @click="openCreateUserModal">Create User</button>
  
      <div v-if="loading">Loading...</div>
  
      <ul v-if="!loading">
        <li v-for="user in users" :key="user._id">
          {{ user.member_username }}
          <button @click="openEditUserModal(user)">Edit</button>
          <button @click="confirmDeleteUser(user._id)">Delete</button>
        </li>
      </ul>
  
      <div v-if="openUser">
        <form @submit.prevent="onEdit ? editUser() : createNewUser()">
          <input v-model="user.member_username" placeholder="username" required />
          <input v-model="user.member_password" placeholder="password" required />
          <button type="submit">{{ onEdit ? 'Update' : 'Create' }}</button>
          <button @click="closeUserModal">Cancel</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getUsers, createUser, deleteUser, updateUser, getUser } from '@/service/UserService'
  
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
  