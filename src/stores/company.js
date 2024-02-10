import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Company } from '@/service/Company'

export const useCompanyStore = defineStore('company', () => {
  const myCompanies = ref([])
  const myCompany = ref({})
  const mySignatures = ref([])
  
  const getMyCompanies = async () => {
    const data = await Company.getMyCompanies()
    myCompanies.value = data.data
    console.log(myCompanies.value)
  }

  const getMyCompany = async (id) => {
    const data = await Company.getMyCompany(id)
    myCompany.value = data.data
    console.log(myCompany.value)
  }

  const getMySignatures = async () => {
    const data = await Company.getMySignatures()
    mySignatures.value = data.data
    console.log(mySignatures.value)
  }

  return { myCompanies, myCompany, mySignatures, getMyCompany, getMyCompanies, getMySignatures }
})