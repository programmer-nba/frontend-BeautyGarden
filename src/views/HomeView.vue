<template>
  <div>
    <header>
      <div class="mb-10">
        <AdminNavBar />
      </div>
    </header>
    <div v-if="decodedToken?.row === 'admin'">
      <div class="w-full h-auto flex flex-1 gap-5 flex-wrap md:flex-nowrap lg:flex-nowrap">
        <QtHeadCard @choose="ontable('quotation')" :class="table==='quotation' ? 'shadow-lg shadow-yellow-200' : ''" />
        <InHeadCard @choose="ontable('invoice')" :class="table==='invoice' ? 'shadow-lg shadow-blue-200' : ''" />
        <ReHeadCard @choose="ontable('receipt')" :class="table==='receipt' ? 'shadow-lg shadow-green-200' : ''" />
      </div>
  
      <div class="pt-5 h-full overflow-y-auto">
        
          <QtTable @referQt="referQt" v-if="table==='quotation'" />
        
        
          <InTable :refQt="refQt" @refIv="refIv" @chooseRef="ontable('receipt')" v-if="table==='invoice'" />

        
          <ReTable :ivref="ivref" v-if="table==='receipt'" />
        
      </div>
      <pre class="hidden">
        {{ decodedToken }}
      </pre>
    </div>
  </div>
</template>

<script setup>
import AdminNavBar from '@/components/NavBar/AdminNavBar.vue'
import InHeadCard from '@/components/Card/InHeadCard.vue'
import ReHeadCard from '@/components/Card/ReHeadCard.vue'
import QtHeadCard from '@/components/Card/QtHeadCard.vue'
import QtTable from '@/components/Table/QtTable.vue'
import InTable from '@/components/Table/InTable.vue'
import ReTable from '@/components/Table/ReTable.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

onMounted(()=>{
  
  if (!ssgdToken.value) {
    router.push('/login')
  } else if (decodedToken.value.row !== 'admin') {
    router.push('/customers')
  }

})

const auth = useAuthStore()
const decodedToken = computed(() => auth.decodedToken)
const router = useRouter()
const table = ref('quotation')

const ssgdToken = ref(localStorage.getItem('ssgdToken'))
const refQt = ref()
const referQt = (val) => {
  console.log(val)
  if (val) {
    refQt.value = val
    table.value==='invoice'
    ontable('invoice')
  }
}

const ivref = ref()
const refIv = (val) => {
  console.log(val)
  if (val) {
    ivref.value = val
  }
}

const ontable = (data) => {
  table.value = data
  ivref.value = null
}

</script>

<style scoped>

</style>
