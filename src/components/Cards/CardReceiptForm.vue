<template>
    <div
      class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
    >
      <div class="rounded-t bg-white mb-0 px-6 py-6">
        <div class="flex justify-center pb-4">
          <span class="text-xl font-semibold inline-block py-1 px-6 rounded-full text-teal-600 bg-teal-200 uppercase last:mr-0 mr-1">
            ใบเสร็จรับเงิน ( Receipt )
          </span>
        </div>
        <div class="flex gap-y-3 flex-wrap justify-between text-sm">
          <div class="flex">
            <div class="flex flex-col">
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ผู้ติดต่อ Contact : </span>
                <span class="pl-2 ml-2">คุณแนท</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">โทรศัพท์ Tel : </span>
                <span class="pl-2 ml-2">099-9999999</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ชื่อลูกค้า Customer Name : </span>
                <span class="pl-2 ml-2">{{ formData.customer_detail.customer_name }}</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">สาขา Branch : </span>
                <span class="pl-2 ml-2">{{ formData.customer_detail.customer_lastname }}</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ที่อยู่ Address : </span>
                <div class="pl-2 ml-2 flex flex-col">
                  <span>
                    {{ address.houseNo }} {{ address.subdistrict }} {{ address.district }}
                  </span>
                  <span>{{ address.province }} {{ address.postcode }}</span>
                </div> 
              </div>
            
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">เลขประจำตัวผู้เสียภาษีอากร TAX ID : </span>
                <span class="pl-2 ml-2">{{ formData.customer_detail.tax_id }}</span>
              </div>

              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">โทรศัพท์ Tel : </span>
                <span class="pl-2 ml-2">{{ formData.customer_detail.customer_phone }}</span>
              </div>

              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">อีเมล์ Email : </span>
                <span class="pl-2 ml-2">{{ formData.customer_detail.customer_email }}</span>
              </div>
             
            </div>
          </div>
          <div class="pr-4 mr-4">
            <div class="flex">
              <div class="flex flex-col text-left">
                <span class="pr-4 mr-4 font-semibold">วันที่ Date :</span>
                <span class="pr-4 mr-4 font-semibold">เลขที่ : </span>
                <span class="pr-4 mr-4 font-semibold">ใบเสนอราคาเลขที่ Ref. Quotation No. :</span>
                <span class="pr-4 mr-4 font-semibold">ใบแจ้งหนี้ Ref. Invoice No. :</span>
                <span class="pr-4 mr-4 font-semibold">วันครบกำหนดชำระเงิน Due Date :</span>
                <span class="pr-4 mr-4 font-semibold">สกุลเงิน Currence :</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="pr-4 mr-4">{{ thaiDateFormatted ? thaiDateFormatted : '-' }}</span>
                <span class="pr-4 mr-4">{{ predictNextCode(receipt_lastcode) }}</span>
                <span class="pr-4 mr-4">{{ formData.quotation ?? refQuotation ?? '-' }}</span>
                <span class="pr-4 mr-4">{{ formData.invoice ?? '-' }}</span>
                <span class="pr-4 mr-4">{{ thaiDateFormattedDue ? thaiDateFormattedDue : '-' }}</span>
                <span class="pr-4 mr-4">บาท/THB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
        <form>

          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            ข้อมูลใบเสร็จ
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  วันที่ : Date 
                  <span class="mx-4 text-xs font-semibold inline-block py-1 px-2 rounded text-emerald-600 bg-emerald-200 last:mr-0 mr-1 uppercase" :class="!thaiDateFormatted ? 'hidden' : ''">
                    {{ thaiDateFormatted }}
                  </span>
                </label>
                <input
                  type="date"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  v-model="thaiDate"
                  @Input="changeToThaiDate"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  เลขที่ : Document No.
                </label>
                <input
                  type="text"
                  class="px-3 py-3 border-0 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  disabled
                  :value="predictNextCode(receipt_lastcode)"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ใบเสนอราคาเลขที่ Ref. Quotation No.
                </label>
                <input
                  type="email"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="refQuotation"
                />
                <SearchQtDropdown @refQuotation="refQThandle"/>
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                ใบแจ้งหนี้ Ref. Invoice No.
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                วันครบกำหนดชำระเงิน Due Date
                <span class="mx-4 text-xs font-semibold inline-block py-1 px-2 rounded text-red-600 bg-red-200 last:mr-0 mr-1 uppercase" :class="!thaiDateFormattedDue ? 'hidden' : ''">
                  {{ thaiDateFormattedDue }}
                </span>
                </label>
                <input
                  type="date"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  v-model="thaiDateDue"
                  @Input="changeToThaiDateDue"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                ใบแจ้งหนี้ Ref. Invoice No.
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                />
              </div>
            </div>
          </div>
          
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            ข้อมูลลูกค้า
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
                  v-model="customerFullName"
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
                  v-model="formData.customer_detail.tax_id"
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
                  v-model="formData.customer_detail.customer_email"
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
                  v-model="formData.customer_detail.customer_phone"
                />
              </div>
            </div>
          </div>
  
          <hr class="mt-6 border-b-1 border-blueGray-300" />
  
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            ที่อยู่ลูกค้า
          </h6>
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
                  v-model="address.houseNo"
                />
              </div>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ตำบล
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="address.subdistrict"
                />
              </div>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  อำเภอ
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="address.district"
                />
              </div>
            </div>
            <div class="w-full lg:w-4/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  จังหวัด
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="address.province"
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
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="address.postcode"
                />
              </div>
            </div>
          </div>

          <hr class="mt-6 border-b-1 border-blueGray-300" />
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            รายละเอียดสินค้า/บริการ
          </h6>
          
            <AddProductModal v-if="openAddProduct" 
            @closeModal="openAddProduct=false" 
            @addToProduct="addProducts"/>
          
          <div
          class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div class="rounded-t mb-0 px-4 py-3 border-0">
              <div class="flex flex-wrap items-center">
                <div class="relative w-full px-4 max-w-full flex-grow flex-1 text-blueGray-500">
                  <h3 class="font-semibold text-lg">
                    รายละเอียดสินค้า
                    
                  </h3>
                  <small class="text-xs px-2">จำนวนรายการทั้งหมด {{ formData.product_detail.length }}</small>
                </div>
                <button class="px-4 py-2 text-white rounded bg-orange-500" @click.prevent="openAddProduct=true">เพิ่ม <i class="fas fa-plus-circle"></i></button>
              </div>
            </div>
            <div class="block w-full overflow-x-auto">
              <!-- Projects table -->
              <table class="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th
                    class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                    ที่
                    </th>

                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                    รูปสินค้า
                    </th>
        
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                    รายละเอียด
                    </th>
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      ราคาต่อหน่วย
                    </th>
                    
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      จำนวน
                    </th>
                    
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    >
                      ราคา (บาท)
                    </th>
                    
                    <th
                      class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                    ></th>
                  </tr>
                </thead>
                <!-------------------------------------------------------------------------------------------------------------->
                <tbody>
                  <tr v-for="(product, index) in formData.product_detail" :key="index">
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                      {{ index+1 }}
                    </td>
        
                    <th
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center"
                    >
                    <div class="flex flex-wrap justify-center" v-if="product.product_logo !=='' && product.product_logo">
                      <div class="px-4 cursor-pointer" 
                      style="width:150px; height:120px;" 
                      @click="showPic(product.product_logo)">
                        <img :src="product.product_logo" 
                        :alt="product.product_name" 
                        class="shadow rounded object-cover w-full h-full align-middle border-none" />
                      </div>
                      <PictureModal 
                        v-if="openPicDialog" 
                        @closePicModal="closePic" 
                        :url="curPicUrl"/>
                    </div>

                    <input v-if="product.product_logo ==='' || !product.product_logo" type="file" @change="handleFileChange($event, index)"/>
    
                    </th>

                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                      {{ product.product_name }}
                    </td>

                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                      {{ product.product_price.toLocaleString() }}
                    </td>
                    
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                      {{ product.product_amount.toLocaleString() }}
                    </td>
                    
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
                    >
                    {{ (product.product_price * product.product_amount).toLocaleString() }}
                    </td>
                    
                    <td
                      class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right"
                    >
                      <table-dropdown />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr class="mt-6 border-b-1 border-blueGray-300" />
  
          <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
            ข้อมูลเพิ่มเติมเกี่ยวกับลูกค้า
          </h6>
          <div class="flex flex-wrap">
            <div class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  รายละเอียด
                </label>
                <textarea
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  rows="4"
                  :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                  :disabled="!edit"
                  v-model="formData.note"
                >
                </textarea>
              </div>
            </div>
          </div>
          <div class="flex w-full justify-center items-center mt-4">
            <button 
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
            type="button"
            @click.prevent="createNewDocument"
            >
              สร้างเอกสาร
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  import { ref, computed, onMounted } from 'vue'
  //import logo from '@/assets/img/logo.png'
  import axios from 'axios'
  import AddProductModal from '@/components/Modals/AddProductModal.vue'
  import PictureModal from '@/components/Modals/PictureModal.vue'
  import TableDropdown from "@/components/Dropdowns/TableDropdown.vue";
  import SearchQtDropdown from '@/components/Dropdowns/SearchQtDropdown.vue'
  
  const edit = ref(true)
  const thaiDate = ref('')
  const receipt_lastcode = ref('')
  const thaiDateDue = ref('')
  const openPicDialog = ref(false)
  const curPicUrl = ref(null)
  const refQuotation = ref(null)

  const img = ref('')

  const refQThandle = (event) => {
    refQuotation.value = event
  }

const handleFileChange = (event, index) => {
const fileInput = event.target
const file = fileInput.files[0]
  if (file) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        //img.value = e.target.result
        formData.value.product_detail[index].product_logo = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please choose an image file.')
    }
  }
}

  const showPic = (imgLink) => {
    openPicDialog.value = true
    curPicUrl.value = imgLink
  }

  const closePic = () => {
    openPicDialog.value = false
    curPicUrl.value = null
  }

  const openAddProduct = ref(false)

  const address = ref({
    houseNo: '',
    subdistrict: '',
    district: '',
    province: '',
    postcode: '',
  })

  const formData = ref({
    invoice: null,
    quotation: null,
    customer_number: "CT0001",
    customer_detail: {
      tax_id: "0001112223333",
      customer_name: "บริษัท ยุงกัดไม่หยุด จำกัด",
      customer_lastname: "(สำนักงานใหญ่)",
      customer_phone: "053-000-000",
      customer_email: "mosquito_comp@test.com",
      customer_address: "",
      customer_type: "credit30"
    },
    product_detail: [],
    ShippingCost: 0,
    start_date: null,
    end_date: null,
    note: ""
  })

  const addProducts = (value) => {
    formData.value.product_detail.push(value)
    console.log(formData.value.product_detail)
  }

  const customerFullName = computed(()=>{
    return `${formData.value.customer_detail.customer_name} ${formData.value.customer_detail.customer_lastname}`
  })

  const customerFullAddress = computed(()=>{
    return `${address.value.houseNo} ${address.value.subdistrict} ${address.value.district} ${address.value.province} ${address.value.postcode}`
  })

  onMounted(()=>{
    fetchData()
  })

  const predictNextCode = (curCode) => {
    const curDate = new Date()
    const year = curDate.getFullYear();
    const month = String(curDate.getMonth() + 1).padStart(2, '0');
    const day = String(curDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;

    let numericPart = curCode.slice(-4)
    let incrementedNumericPart = String(Number(numericPart) + 1).padStart(4, '0');
    let newCode = 
      (curCode) ? curCode.slice(0, -4) + incrementedNumericPart 
      : 'REP' + formattedDate + incrementedNumericPart

    return newCode
  }
  
  const createNewDocument = async () => {
      formData.value.customer_detail.customer_address = customerFullAddress.value
      formData.value.start_date = thaiDateFormatted.value
      formData.value.end_date = thaiDateFormattedDue.value
    try{
      const response = await axios.post(`${process.env.VUE_APP_API_BACKEND}/receiptVat/ReceiptVat`,
          formData.value,
        {
          headers: {
            'auth-token' : `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
          }
        }
      )
      if(response.data.status){
        console.log(response.data.data)
        alert(response.data.message)
      }
    }
    catch(err){
      console.error(err)
    }
  }

  const fetchData = async () => {
    try{
      const response = await axios.get(`${process.env.VUE_APP_API_BACKEND}/receiptVat/getReceiptVatAll`,
        {
          headers: {
            'auth-token' : `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
          }
        }
      )
      if(response.data.status){
        receipt_lastcode.value = response.data.data[response.data.data.length - 1].receipt
      }
    }
    catch(err){
      console.error(err)
    }
  }

  const thaiDateFormatted = computed(()=>{
    const inputDate = thaiDate.value
    if(inputDate) {
      const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const dateObject = new Date(inputDate);

    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();

    const formattedDate = `${day} ${monthsThai[monthIndex]} ${year}`;

    return formattedDate;
    } else {
      return ''
    }
    
  })

  const thaiDateFormattedDue = computed(()=>{
    const inputDate = thaiDateDue.value
    if(inputDate) {
      const monthsThai = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];

    const dateObject = new Date(inputDate);

    const day = dateObject.getDate();
    const monthIndex = dateObject.getMonth();
    const year = dateObject.getFullYear();

    const formattedDate = `${day} ${monthsThai[monthIndex]} ${year}`;

    return formattedDate;
    } else {
      return ''
    }
    
  })
  
  const changeToThaiDate = () => {
    const selectedDate = thaiDate.value;

    if (selectedDate) {
      // Parse the selected date as a JavaScript Date object
      const dateObject = new Date(selectedDate);

      // Convert the Western year to the Thai Buddhist calendar year
      const thaiBuddhistYear = dateObject.getFullYear() + 543;

      // Format the date as "yyyy-MM-dd"
      const formattedDate = `${thaiBuddhistYear}-${(dateObject.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

      thaiDate.value = formattedDate;
    }
  }

  const changeToThaiDateDue = () => {
    const selectedDate = thaiDateDue.value;
    if (selectedDate) {
      // Parse the selected date as a JavaScript Date object
      const dateObject = new Date(selectedDate);

      // Convert the Western year to the Thai Buddhist calendar year
      const thaiBuddhistYear = dateObject.getFullYear() + 543;

      // Format the date as "yyyy-MM-dd"
      const formattedDate = `${thaiBuddhistYear}-${(dateObject.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')}`;

      thaiDateDue.value = formattedDate;
    }
  }

  const toggleEdit = () => {
    edit.value = !edit.value;
  }
  
  const saveData = () => {
    // Add logic to save the data, e.g., send it to a server
    toggleEdit(); // Optional: Toggle back to view mode after saving
  }
  </script>

  
  