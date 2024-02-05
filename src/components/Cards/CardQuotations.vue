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
            ใบเสนอราคา (Quotations)
          </h3>
          <small class="text-xs px-2">จำนวนใบเสนอราคาทั้งหมด {{ quotations.length }} ใบ</small>
        </div>
        <router-link to="/admin/document/quotation" v-slot="{navigate}">
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
              เลขที่ใบเสนอราคา
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
          <tr v-for="(quotation, index) in quotations" :key="quotation._id">
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ index+1 }}
            </td>

            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ quotation.quotation }}
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
                {{ quotation.customer_detail?.customer_name }} {{ quotation.customer_detail?.customer_lastname !== 'null' ? `(${quotation.customer_detail?.customer_lastname})` : '' }}
              </span>
            </th>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ quotation.start_date }}
            </td>

            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              {{ quotation.end_date }}
            </td>
            
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
            {{ formatNumber(quotation.total) }}
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
            >
              <i class="fas fa-circle text-orange-500 mr-2"></i> อยู่ในระหว่างดำเนินการ
            </td>
            <td
              class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
            >
              <QuotationTableDropdown @deleted="deletedhandle" :quotation="quotation" @seeDoc="seeDocHandle"/>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex w-full justify-center items-center mt-4">
        <DraftQuotation 
        :customer="{
          name: quotation?.customer_detail?.customer_name || '-',
          address: quotation?.customer_detail?.customer_address || '-',
          taxId: quotation?.customer_detail?.tax_id || '-',
        }"
        :quotation="{
          code: quotation.quotation || '-',
          start_date: quotation.start_date || '-',
          end_date: quotation.end_date || '-',
        }"
        :items="quotation?.product_detail || []"
        :totalProductPrice="sumVat ? formattNumber(sumProductsPrice) : formattNumber(sumProductsPrice-vat)"
        :discount="formattNumber(formData.discount)"
        :discountedPrice="sumVat ? formattNumber(discountedPrice) :formattNumber(sumProductsPrice-vat-formData.discount)"
        :vat="formattNumber(vat)"
        :vatIncludedPrice="
          (sumVat) ? formattNumber(discountedPrice+vat) : formattNumber(discountedPrice)"
        :deducatePercent="isDeducate ? paidVatpercent : null"
        :deducatedPrice="(sumVat&&isDeducate) ? formattNumber(paidVat) : (!sumVat&&isDeducate) ? formattNumber(((sumProductsPrice-vat-formData.discount) * paidVatpercent/100)) : null"
        :net="
          (sumVat && isDeducate) ? formattNumber(discountedPrice+vat-paidVat) 
          : (sumVat && !isDeducate) ? formattNumber(discountedPrice+vat) 
          : (!sumVat && isDeducate) ? formattNumber(discountedPrice-((sumProductsPrice-vat-formData.discount) * paidVatpercent/100))
          : formattNumber(discountedPrice)"
        :sumVat="sumVat"
        :remark="formData.note"
        :headData="headData"
        @createDoc="createNewDocument"
        />
      </div>
    </div>
    <TealAlert v-if="isAlert" :detail="detail"/>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from 'axios'
import { ref, onMounted } from 'vue'
import TealAlert from "@/components/Alerts/TealAlert.vue"
import QuotationTableDropdown from "@/components/Dropdowns/QuotationTableDropdown.vue"

/*  variables  */

const quotations = ref([])
const quotation = ref({})
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

// deleted handle
const deletedhandle = async () => {
  await fetchQuotations()
  isAlert.value = true
}

// close Alert handle
const closeAlert = () => {
  isAlert.value = false
}

// change date to Thai format
const formatDate = ( inputDate ) => {
  if(inputDate){
    const parts = inputDate.split('-')
    const formattedDate = new Intl.DateTimeFormat('th-TH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    }).format(new Date(`${parts[1]}-${parts[2]}-${parts[0]-543}`))
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

// get all quotations
const fetchQuotations = async () => {
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/quotation/getQuotationAll`, 
    {
      headers: {
        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
      }
    }).then(( response ) => {
      if ( response.data.status ) {
        quotations.value = response.data.data.reverse()
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

const seeDocHandle = (data) => {
  quotaion.value = data
  openDialog.value = true
}

/*  Mounted   */
onMounted(() => {
  fetchQuotations()
})
</script>
