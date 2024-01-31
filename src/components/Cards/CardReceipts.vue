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
            ใบเสร็จรับเงิน (RECEIPT)
            <span @click="changeVat" class="text-xs mx-4 font-semibold inline-block py-1 px-2 rounded-full text-black bg-orange-200 uppercase last:mr-0 mr-1 cursor-pointer">
              VAT
            </span>
          </h3>
          <small class="text-xs px-2">จำนวนใบเสร็จทั้งหมด {{ receipts.length }} ใบ</small>
        </div>
        <button class="px-4 py-2 text-white rounded bg-orange-500">เพิ่ม <i class="fas fa-plus-circle"></i></button>
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
              เลขที่ใบเสร็จ
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
              วันที่ออก
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
              ประเภท
            </th>
            
            <th
              class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"
              :class="[
                color === 'light'
                  ? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
                  : 'bg-emerald-800 text-emerald-300 border-emerald-700',
              ]"
            >
            </th>
          </tr>
        </thead>
        <!-------------------------------------------------------------------------------------------------------------->
        <tbody>
          <tr v-for="(receipt, index) in receipts" :key="receipt._id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ index + 1 }}
            </td>

            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ receipt.receipt }}
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
                {{ receipt.customer_detail?.customer_name }} {{ receipt.customer_detail?.customer_name ? '(สำนักงานใหญ่)' : '' }}
              </span>
            </th>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ formatDate(receipt.start_date) || receipt.start_date }}
            </td>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            {{ formatNumber(receipt.total) }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <span v-if="receipt.isVat" class="text-xs font-semibold inline-block py-1 px-2 rounded text-black bg-orange-200 uppercase last:mr-0 mr-1">
                VAT
              </span>
              <span v-if="receipt.withholding" class="text-xs font-semibold inline-block py-1 px-2 rounded text-black bg-orange-200 uppercase last:mr-0 mr-1">
                หัก ณ ที่จ่าย
              </span>
            </td>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
            >
              <receipt-table-dropdown @deleted="deletedhandle" :receipt="receipt" />
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
import { ref, onMounted, defineEmit } from 'vue'
import ReceiptTableDropdown from "@/components/Dropdowns/ReceiptTableDropdown.vue"
import TealAlert from "@/components/Alerts/TealAlert.vue"

/*  variables  */
const receipts = ref([])
const emit = defineEmit(["changeToNoVat"])

const isAlert= ref(false)
const detail= {
  text: 'ลบใบเสร็จเรียบร้อยแล้ว',
  title: 'ลบใบเสร็จ'
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

const closeAlert = () => {
  isAlert.value = false
}

const deletedhandle = async () => {
  await fetchReceipts()
  isAlert.value = true
}


// change date to Thai format
const formatDate = ( inputDate ) => {
  if(inputDate && inputDate.includes("/")){
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

// emit change to no-VAT
const changeVat = () => {
  emit("changeToNoVat")
}

/*  api  */

// get all invoices
const fetchReceipts = async () => {
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/receiptVat/getReceiptVatAll`, 
    {
      headers: {
        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
      }
    }).then(( response ) => {
      if ( response.status ) {
        receipts.value = response.data.data.reverse()
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
  fetchReceipts()
})
</script>
