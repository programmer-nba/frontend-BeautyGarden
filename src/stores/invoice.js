import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Documents } from '@/service/ProductService'

export const useInvoiceStore = defineStore('invoice', () => {
  const invoices = ref([])

  const invoicesAmount = computed(()=>{
    if( invoices.value && invoices.value.length ) {
        return invoices.value.length
    } else {
        return '...'
    }
  })
  
  const getInvoices = async () => {
    const data = await Documents.getInvoices()
    invoices.value = data.data
    console.log(invoices.value)
  }

  const uploadFileInvoice = async (id, invoiceId) => {
    const data = await Documents.uploadFileInvoice(id, invoiceId)
    console.log(data.data)
  }

  return { invoices, invoicesAmount, getInvoices, uploadFileInvoice }
})