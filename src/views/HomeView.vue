<template>
  <div>
    <header>
      <div class="mb-10">
        <AdminNavBar />
      </div>
    </header>
    <div>
      <div class="w-full h-auto flex flex-1 gap-5 flex-wrap md:flex-nowrap lg:flex-nowrap">
        <QtHeadCard @choose="ontable('quotation')" :class="table==='quotation' ? 'shadow-lg shadow-yellow-200' : ''" />
        <InHeadCard @choose="ontable('invoice')" />
        <ReHeadCard @choose="ontable('receipt')" :class="table==='receipt' ? 'shadow-lg shadow-green-200' : ''" />
      </div>
  
      <div class="pt-5">
        <QtTable v-if="table==='quotation'"  />
        <ReceiptTable v-if="table==='receipt'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminNavBar from '@/components/NavBar/AdminNavBar.vue'
import InHeadCard from '@/components/Card/InHeadCard.vue'
import ReHeadCard from '@/components/Card/ReHeadCard.vue'
import QtHeadCard from '@/components/Card/QtHeadCard.vue'
import QtTable from '@/components/Table/QtTable.vue'
import ReceiptTable from '@/components/Table/ReceiptTable.vue'
import { ref } from 'vue'

const table = ref('quotation')

const ontable = (data) => {
  table.value = data
}

</script>

<style scoped>

</style>
