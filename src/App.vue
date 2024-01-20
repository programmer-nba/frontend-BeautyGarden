<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/base/Navbar.vue'
import Footer from './components/base/Footer.vue';
</script>

<template>
  <header class="p-0 m-0">
    <Navbar />
  </header>

  <main class="p-0 m-0">
    <RouterView />
  </main>
  
  <footer class="p-0 m-0">
    <Footer/>
  </footer>
</template>

<style scoped>

</style>
