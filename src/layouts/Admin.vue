<template>
  <div>
    <sidebar />
    <div class="relative md:ml-64 bg-blueGray-100">
      <admin-navbar />
      <!-- <div v-if="['/admin/documents', '/admin/dashboard', '/admin/customers'].includes(currentPath)">
        <header-stats />
      </div> -->
      <div v-if="['/admin/settings', '/admin/document/invoice', '/admin/document/receipt', '/admin/document/quotation', '/','/admin/documents','/admin/dashboard','/admin/customers'].includes(currentPath)">
        <HeaderDocuments />
      </div>
      <div class="px-4 mx-auto w-full h-full">
        <router-view />
        <footer-admin />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import AdminNavbar from "@/components/Navbars/AdminNavbar.vue";
import Sidebar from "@/components/Sidebar/Sidebar.vue";
import HeaderStats from "@/components/Headers/HeaderStats.vue";
import HeaderDocuments from "@/components/Headers/HeaderDocuments.vue";
import FooterAdmin from "@/components/Footers/FooterAdmin.vue";
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "admin-layout",
  components: {
    AdminNavbar,
    Sidebar,
    HeaderStats,
    FooterAdmin,
    HeaderDocuments
  },
  setup() {
    const route = useRoute();
    const currentPath = ref(route.path);

    // Watch for changes in the route path
    watch(() => route.path, (newPath) => {
      currentPath.value = newPath;
    });

    return {
      currentPath,
    };
  },
};
</script>
