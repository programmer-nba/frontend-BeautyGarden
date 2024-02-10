import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Documents } from '@/service/ProductService'

export const useQuotationStore = defineStore('quotation', () => {
  const quotations = ref([])

  const quotationsAmount = computed(()=>{
    if( quotations.value && quotations.value.length ) {
        return quotations.value.length
    } else {
        return '...'
    }
  })
  
  const getQuotations = async () => {
    const data = await Documents.getQuotations()
    quotations.value = data.data
    console.log(quotations.value)
  }

  const uploadFileQuotation = async (id, quotationId) => {
    const data = await Documents.uploadFileQuotation(id, quotationId)
    console.log(data.data)
  }

  return { quotations, quotationsAmount, getQuotations, uploadFileQuotation }
})