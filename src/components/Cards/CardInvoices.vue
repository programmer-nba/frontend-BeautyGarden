<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    style="max-height: 600px; height: auto;"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']"
  >
    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"
          >
            ใบแจ้งหนี้ (Invoices)
          </h3>
          <small class="text-xs px-2">จำนวนใบแจ้งหนี้ทั้งหมด {{ invoices.length }} ใบ</small>
        </div>
        <router-link to="/admin/document/invoice" v-slot="{navigate}">
          <button @click="navigate" class="px-4 py-2 text-white rounded bg-orange-500">เพิ่ม <i class="fas fa-plus-circle"></i></button>
        </router-link>
        
      </div>
    </div>
    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead style="position: sticky; top: 0;">
          <tr>
            <th
            class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
            :class="[
              color === 'light'
                ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
            ที่
            </th>

            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              เลขที่ใบแจ้งหนี้
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              ชื่อลูกค้า
            </th>
            
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              วันที่เริ่มต้น
            </th>

            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              วันที่สิ้นสุด
            </th>
            
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              จำนวน (บาท)
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              สถานะ
            </th>
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            ></th>
          </tr>
        </thead>
        <!-------------------------------------------------------------------------------------------------------------->
        <tbody class="overflow-y-auto">
          <tr v-for="(invoice, index) in invoices" :key="invoice._id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ index+1 }}
            </td>

            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ invoice.invoice }}
            </td>
            <th
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
            >
              <!-- <img
                :src="customer_01"
                class="h-12 w-12 bg-white rounded-full border"
                alt="..."
              /> -->
              <span
                class="ml-3 font-bold"
                :class="[
                  color === 'light' ? 'text-blueGray-600' : 'text-white',
                ]"
              >
                {{ invoice.customer_detail?.customer_name }} {{ invoice.customer_detail?.customer_lastname ? `(${invoice.customer_detail?.customer_lastname})` : '' }}
              </span>
            </th>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ formatDate(invoice.start_date) }}
            </td>

            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ formatDate(invoice.end_date) }}
            </td>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            {{ formatNumber(invoice.total) }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <i class="fas fa-circle text-orange-500 mr-2"></i> อยู่ในระหว่างดำเนินการ
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
            >
              <InvoiceTableDropdown @deleted="deletedhandle" :invoice="invoice" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <TealAlert v-if="isAlert" :detail="detail"/>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios'
import { ref, onMounted } from 'vue'
import TealAlert from "@/components/Alerts/TealAlert.vue"
import InvoiceTableDropdown from "@/components/Dropdowns/InvoiceTableDropdown.vue"

/*  variables  */

const invoices = ref([])
const isAlert= ref(false)
const detail= {
  text: 'ลบใบแจ้งหนี้เรียบร้อยแล้ว',
  title: 'ลบใบแจ้งหนี้'
}

/* props */

const props = defineProps({
  color: {
    type: String,
    default: "light",
    validator: ( value ) => {
      return [ "light", "dark" ].indexOf( value ) !== -1
    },
  },
})

/*  function  */

// deleted handle
const deletedhandle = async () => {
  await fetchInvoices()
  isAlert.value = true
}

// close Alert handle
const closeAlert = () => {
  isAlert.value = false
}

// change date to Thai format
const formatDate = ( inputDate ) => {
  console.log(inputDate)
  if(inputDate){
    /* const parts = inputDate.split('/')
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    }) */
    //.format(new Date(`${parts[1]}-${parts[2]}-${parts[0]-543}`))
    return inputDate
  } else {
    return '-'
  }
}

// format number to localString
const formatNumber = ( inputNumber ) => {
  if ( inputNumber ) {
    const formattedNumber = inputNumber.toLocaleString('en-US', 
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )
    return formattedNumber
  } else {
    return 'NaN'
  }
}

/*  api  */

// get all quotations
const fetchInvoices = async () => {
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/invoice/getInvoiceVatAll`, 
    {
      headers: {
        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
      }
    }).then(( response ) => {
      if ( response.data.status ) {
        invoices.value = response.data.data.reverse()
        if(isAlert.value){
          setTimeout(closeAlert, 5000)
        }
      } else {
        console.log( 'Something went wrong!' )
      }
    }).catch(( error ) => {
      console.error( error.message )
      console.log( error.response.data.message )
    })
}

/*  Mounted   */
onMounted(() => {
  fetchInvoices()
})
</script>
