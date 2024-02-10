<template>
    <header>
      <div class="mb-10">
        <AdminNavBar />
      </div>
    </header>
    <div>
      <div class="pt-5">
        <Company />
      </div>
    </div>
   
  </template>
  
  <script setup>
  import AdminNavBar from '@/components/NavBar/AdminNavBar.vue'
  import Company from '@/components/Table/Company.vue'
  import { ref } from 'vue'
  
  const table = ref('quotation')
  
  const ontable = (data) => {
    table.value = data
  }
  
  </script>
  
  <style scoped>
  
  </style>
  