import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Documents } from '@/service/ProductService'

export const useReceiptStore = defineStore('receipt', () => {
  const receipts = ref([])

  const receiptsAmount = computed(()=>{
    if( receipts.value && receipts.value.length ) {
        return receipts.value.length
    } else {
        return '...'
    }
  })
  
  const getReceipts = async () => {
    const data = await Documents.getReceipts()
    receipts.value = data.data
    console.log(receipts.value)
  }

  const uploadFileReceipt = async (id, receiptId) => {
    const data = await Documents.uploadFileReceipt(id, receiptId)
    console.log(data.data)
  }

  return { receipts, receiptsAmount, getReceipts, uploadFileReceipt }
})