<template>
  <!-- Header -->
  <div class="relative bg-emerald-600 md:pt-32 pb-32 pt-12">
    <div class="px-4 md:px-10 mx-auto w-full">
        <div class="w-full lg:w-full xl:w-full py-6 px-4 bg-white rounded">
          <div class="flex flex-wrap justify-center items-center"> 
            <img src="@/assets/img/logo.png" alt="..." class="shadow rounded-full w-20 h-20 align-middle border-none"/>
            <div class="">
              <p class="align-middle px-4 text-xl font-semibold">{{ curhead?.Branch_company_name }} {{ curhead?.Branch_iden ? `(${curhead?.Branch_iden})` : '' }}
                <span v-if="curhead?.isVat" class="text-xs font-semibold inline-block py-1 px-2 mx-4 rounded-full text-orange-600 bg-orange-200 uppercase last:mr-0 mr-1">
                  VAT
                </span>
              </p>
              <p class="px-4 text-sm">{{ curhead?.Branch_company_address ? curhead?.Branch_company_address : '146 ถนนจอมทองบูรณะ แขวงบางมด เขตบางมด กรุงเทพมหานคร 10150' }}</p>
              <p class="px-4 text-sm">โทร: {{ curhead?.Branch_company_number }} เลขประจำตัวผู้เสียภาษี: {{ curhead?.taxnumber ? curhead?.taxnumber : '0-1055-66228-53-5' }} อีเมล์: {{ curhead?.company_email }}</p>
            </div>
            <button class="text-lg mx-4 px-2 border rounded" @click.prevent="switchHeader">►</button>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from "axios"
import { ref, onMounted, watch } from "vue"
//import { EventBus } from '@/../EventBus.js';

const headDatas = ref([])
const curhead = ref()
const curHeadIsValid = ref()

const switchHeader = () => {
  const curIndex = headDatas.value.findIndex(item=>item._id===curhead.value._id)
  let nextIndex = null
  if(curIndex+1 === headDatas.value.length){
    nextIndex = 0
  } else {
    nextIndex = curIndex+1
  }
  const id = headDatas.value[nextIndex]._id
  localStorage.removeItem('headerId')
  localStorage.setItem('headerId', id)
  curhead.value = headDatas.value[nextIndex]
  getHeaders()
}

watch(headDatas,()=>{
  getCurHeadData()
})

const getCurHeadData = async () => {
  const id = localStorage.getItem('headerId')
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/Company/getCompanyBy/${id}`,
    {
      headers : {
        'auth-token' : process.env.VUE_APP_AUTH_TOKEN_ADMIN
      }
    }
  ).then((response)=>{
    curHeadIsValid.value = true
    console.log(response.data.message)
  }).catch((err)=>{
    curHeadIsValid.value = false
    alert(err.response.data.message)
    console.log(err)
  })
}

const getHeaders = async () => {
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/Company/getCompannyAll`,
    {
      headers: {
        'auth-token': process.env.VUE_APP_AUTH_TOKEN_ADMIN
      }
    }
  ).then(async (response) => {
    if(response.data.status){
      console.log(response.data)
      headDatas.value = response.data.data
      if(!localStorage.getItem('headerId')){
        localStorage.setItem('headerId', response.data.data[response.data.data.length-1]._id)
        curhead.value = headDatas.value.find(item=>item._id===localStorage.getItem('headerId'))
      } else {
        await getCurHeadData()
        if(curHeadIsValid.value){
          curhead.value = headDatas.value.find(item=>item._id===localStorage.getItem('headerId'))
        } else {
          localStorage.removeItem('headerId')
          reGetHeaders()
        }
      }
    }
  }).catch((error) => {
    console.error(error)
    console.log(error.response.data.message)
  })
}

const reGetHeaders = () => {
  getHeaders()
}

onMounted(()=>{
  getHeaders()
})
</script>
