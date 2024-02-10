<template>
  <header>
    <div class="mb-10">
      <AdminNavBar />
    </div>
  </header>
  <div>

    <div class="pt-5">
      <Customer/>
    </div>
  </div>
 
</template>

<script setup>
import AdminNavBar from '@/components/NavBar/AdminNavBar.vue'
import Customer from '@/components/Table/Customer.vue'

</script>

<style scoped>

</style>
