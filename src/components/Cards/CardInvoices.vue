<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
    :class="[color === 'light' ? 'bg-white' : 'bg-emerald-900 text-white']"
  >

    <div class="rounded-t mb-0 px-4 py-3 border-0">
      <div class="flex flex-wrap items-center">
        <div class="relative w-full px-4 max-w-full flex-grow flex-1">
          <h3
            class="font-semibold text-lg"
            :class="[color === 'light' ? 'text-blueGray-700' : 'text-white']"
          >
            ใบแจ้งหนี้ (INVOICE)
          </h3>
          <small class="text-xs px-2">จำนวนใบแจ้งหนี้ทั้งหมด {{ invoices.length }} ใบ</small>
        </div>
        <button class="px-4 py-2 text-white rounded bg-orange-500">เพิ่ม <i class="fas fa-plus-circle"></i></button>
      </div>
    </div>

    <div class="block w-full overflow-x-auto">
      <!-- Projects table -->
      <table class="items-center w-full bg-transparent border-collapse">
        <thead>
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
              วันกำหนดจ่าย
            </th>

            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
              ราคา (บาท)
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
              ]">
            </th>

          </tr>
        </thead>

        <tbody v-if="invoices.length < 1">
          <tr>
            <td></td>
            <td></td>
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              ไม่พบข้อมูล
            </td>
          </tr>
        </tbody>

        <tbody v-if="invoices.length > 0">
          
          <tr v-for="( invoice, index ) in invoices" :key="invoice._id">

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ index+1 }}
            </td>

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ invoice.invoice }}
            </td>
            
            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ invoice.customer_detail?.customer_name }} {{ invoice.customer_detail?.customer_lastname }}
            </td>

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ formatDate(invoice.end_date) }}
            </td>

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              {{ formatNumber(invoice.Shippingincluded) }}
            </td>

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
              <i class="fas fa-circle text-orange-500 mr-2"></i> 
              {{ invoice.status[invoice.status?.length-1]?.name ?? 'กำลังตรวจสอบ' }}
            </td>

            <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
              <table-dropdown />
            </td>

          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios'
import { ref, onMounted } from 'vue'
import TableDropdown from "@/components/Dropdowns/TableDropdown.vue"

/*  variables  */

const invoices = ref([])

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

// change date to Thai format
const formatDate = ( inputDate ) => {
  if(inputDate){
    const parts = inputDate.split('/')
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    }).format(new Date(`${parts[2]}-${parts[1]}-${parts[0]}`))
    return formattedDate
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

// get all invoices
const fetchInvoices = async () => {
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/invoice/getInvoiceVatAll`, 
    {
      headers: {
        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
      }
    }).then(( response ) => {
      if ( response.status ) {
        invoices.value = response.data.data
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
