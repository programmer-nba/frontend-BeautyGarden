<template>
    <header>
      <div class="mb-10">
        <AdminNavBar />
      </div>
    </header>
    <div>
  
      <div class="pt-5">
        <Supplier />
      </div>
    </div>
   
  </template>
  
  <script setup>
  import AdminNavBar from '@/components/NavBar/AdminNavBar.vue'
  import Supplier from '@/components/Table/Supplier.vue'
  
  </script>
  
  <style scoped>
  
  </style>
  