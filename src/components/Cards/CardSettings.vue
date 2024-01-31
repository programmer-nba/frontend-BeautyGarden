<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">
          {{ headData.Branch_company_name }} {{ headData.Branch_iden ? `(${headData.Branch_iden})` : '' }}
        </h6>
        <button
          class="bg-yellow-500 text-white active:bg-yellow-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
          type="button"
          @click.prevent="isEdit()"
          v-if="!edit"
          >
            ตั้งค่า
        </button>
        <div class="flex gap-2" v-if="edit">
          <button
            class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            @click.prevent="edit=false"
          >
            ยกเลิก
          </button>
          <button
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            type="button"
            @click.prevent="editHeadData"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูล
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                ชื่อกิจการ / บริษัท
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.Branch_company_name"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                เลขที่สาขา/สำนักงานใหญ่
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.Branch_iden"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                เลขประจำตัวผู้เสียภาษี (TAX ID)
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.taxnumber"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                อีเมล์
              </label>
              <input
                type="email"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.company_email"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                โทรศัพท์
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.Branch_company_number"
              />
            </div>
          </div>
        </div>

        <!-- <hr class="mt-6 border-b-1 border-blueGray-300" /> -->

        <!-- <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูลร้านค้า
        </h6> -->
        <div class="flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                ที่อยู่
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.Branch_company_address"
              />
            </div>
          </div>
          <!-- <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                จังหวัด
              </label>
              <input
                type="email"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="กรุงเทพมหานคร"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
              />
            </div>
          </div>
          <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                ประเทศ
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="ประเทศไทย"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
              />
            </div>
          </div>
          <div class="w-full lg:w-4/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                รหัสไปรษณีย์
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="10150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
              />
            </div>
          </div> -->
        </div>
        
        <div class=flex>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                ชื่อผู้ติดต่อ
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.contact_name"
              />
            </div>
          </div>
  
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                เบอร์ผู้ติดต่อ
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.contact_number"
              />
            </div>
          </div>
        </div>
        

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <!-- <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          เกี่ยวกับฉัน
        </h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                อธิบายรายละเอียด
              </label>
              <textarea
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                rows="4"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
                v-model="headData.detail"
              >
              </textarea>
            </div>
          </div>
        </div> -->
      </form>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios'
import { ref, onMounted, watch } from 'vue'
//import { EventBus } from '@/../EventBus.js';

const edit = ref(false)
const headData = ref({
  bank:[],
  Branch_status: true,
  taxnumber: null,
  Branch_iden: null,
  Branch_iden_number: null,
  Branch_company_name: null,
  Branch_company_number: null,
  Branch_company_address: null,
  contact_name: null,
  contact_number: null,
  company_email:null,
  isVat: true,
  detail: ''
})

const headerId = ref(localStorage.getItem('headerId'))

const pullingHeader = () => {
  headerId.value = localStorage.getItem('headerId')
}
setInterval(pullingHeader, 1000)

const getCurHeadData = async () => {
  const id = headerId.value
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/Company/getCompanyBy/${id}`,
    {
      headers : {
        'auth-token' : process.env.VUE_APP_AUTH_TOKEN_ADMIN
      }
    }
  ).then((response)=>{
    headData.value = response.data.data
    console.log(response.data.message)
  }).catch((err)=>{
    alert(err.response.data.message)
    console.log(err)
  })
}

const editHeadData = async () => {
  const id = headerId.value
  const body = {
    bank: headData.value.back,
    Branch_status: headData.value.Branch_status,
    taxnumber: headData.value.taxnumber,
    Branch_iden: headData.value.Branch_iden,
    Branch_iden_number: headData.value.Branch_iden_number,
    Branch_company_name: headData.value.Branch_company_name,
    Branch_company_number: headData.value.Branch_company_number,
    Branch_company_address: headData.value.Branch_company_address,
    contact_name: headData.value.contact_name,
    contact_number: headData.value.contact_number,
    company_email:headData.value.company_email,
    isVat: headData.value.isVat,
    detail: headData.value.detail
  }
  await axios.put(`${process.env.VUE_APP_API_BACKEND}/Company/EditCompany/${id}`, body,
    {
      headers: {
        'auth-token': process.env.VUE_APP_AUTH_TOKEN_ADMIN
      }
    }).then(async (response)=>{
      console.log(response.data.message)
      await getCurHeadData()
      window.location.reload()
    }).catch((err)=>{
      console.log(err)
      alert(err.response.data.message)
    })
}

onMounted(()=>{
  getCurHeadData()
  pullingHeader()
  setInterval(pullingHeader, 1000)
})

watch(headerId, () => {
  getCurHeadData()
  console.log('pulled')
})

const isEdit = () => {
  edit.value = true
}
</script>

