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
        <!-- <div class="flex gap-y-3 flex-wrap justify-between text-sm">
          <div class="flex">
            <div class="flex flex-col">
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ผู้ติดต่อ Contact : </span>
                <span class="pl-2 ml-2">{{ formData?.customer_detail?.customer_contact }}</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">โทรศัพท์ Tel : </span>
                <span class="pl-2 ml-2">{{ formData?.customer_detail?.customer_contact_number || '-' }} </span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ชื่อลูกค้า Customer Name : </span>
                <span class="pl-2 ml-2">{{ customerFullName }}</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">สาขา Branch : </span>
                <span class="pl-2 ml-2">(สำนักงานใหญ่)</span>
              </div>
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">ที่อยู่ Address : </span>
                <div class="pl-2 ml-2 flex flex-col">
                  <span>
                    {{ formData?.customer_detail?.customer_address }}
                  </span>
                </div> 
              </div>
            
              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">เลขประจำตัวผู้เสียภาษีอากร TAX ID : </span>
                <span class="pl-2 ml-2">{{ formData?.customer_detail?.tax_id }}</span>
              </div>

              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">โทรศัพท์ Tel : </span>
                <span class="pl-2 ml-2">{{ formData?.customer_detail?.customer_phone }}</span>
              </div>

              <div class="flex flex-wrap">
                <span class="pr-2 mr-2 font-semibold">อีเมล์ Email : </span>
                <span class="pl-2 ml-2">{{ formData?.customer_detail?.customer_email }}</span>
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
                <span class="pr-4 mr-4">{{ receipt_lastcode ? predictNextCode(receipt_lastcode) : '-' }}</span>
                <span class="pr-4 mr-4">{{ formData.quotation !== undefined && formData.quotation !== null ? formData.quotation : refQuotation || '-' }}</span>
                <span class="pr-4 mr-4">{{ formData.invoice !== undefined && formData.invoice ? formData.invoice : refInvoice || '-' }}</span>
                <span class="pr-4 mr-4">{{ thaiDateFormattedDue ? thaiDateFormattedDue : '-' }}</span>
                <span class="pr-4 mr-4">บาท/THB</span>
              </div>
            </div>
          </div>
        </div> -->
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
                <p
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ใบเสนอราคาอ้างอิง (ถ้ามี)
                </p>
              </div>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  v-model="formData.quotation"
                />
                <SearchQtDropdown @refQuotation="refQThandle"/>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <p
                class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                >
                  ใบแจ้งหนี้อ้างอิง (ถ้ามี)
                </p>
              </div>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                v-model="formData.invoice"
                />
              <SearchInDropdown @refInvoice="refINhandle"/>
            </div>
            <!-- <div class="w-full lg:w-6/12 px-4">
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
                />
              </div>
            </div> -->
            
          </div>
          <hr class="mt-6 border-b-1 border-blueGray-300" />
          <div class="flex mt-3 py-2">
            <h6 class="text-blueGray-400 mr-3 mt-3 text-sm font-bold uppercase">
              ข้อมูลลูกค้า
            </h6>
            <SearchCustomers @refCustomer="refCThandle"/>
            
          </div>
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
                  v-model="formData.customer_detail.customer_name"
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
                  v-model="formData.customer_detail.customer_phone"
                />
              </div>
            </div>
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ผู้ติดต่อ
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  v-model="formData.customer_detail.customer_contact"
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
                  v-model="formData.customer_detail.customer_contact_number"
                />
              </div>
            </div>
          </div>
  
          <div class="flex flex-wrap">
            <div v-if="!isNewAddress" class="w-full lg:w-12/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ที่อยู่ลูกค้า
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  v-model="formData.customer_detail.customer_address"
                />
              </div>
              <button v-if="!isNewAddress" class="px-4 py-2 text-white rounded bg-orange-500" @click.prevent="isNewAddress=!isNewAddress"> ที่อยู่ใหม่ <i class="fas fa-plus-circle"></i></button>
            </div>
            
            <hr class="mt-6 border-b-1 border-blueGray-300" />
          <div v-if="isNewAddress" class="flex mt-3 py-2">
            <h6 class="text-blueGray-400 mr-3 text-sm font-bold uppercase">
              เพิ่มที่อยู่ใหม่
            </h6>
            
          </div>
            <div v-if="isNewAddress" class="w-full lg:w-12/12 px-4 mb-3">
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
                  v-model="address.houseNo"
                />
              </div>
              
            </div>
            
            <div v-if="isNewAddress" class="w-full lg:w-4/12 px-4">
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
                  v-model="address.subdistrict"
                />
              </div>
            </div>
            <div v-if="isNewAddress" class="w-full lg:w-4/12 px-4">
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
                  v-model="address.district"
                />
              </div>
            </div>
            <div v-if="isNewAddress" class="w-full lg:w-4/12 px-4">
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
                  v-model="address.province"
                />
              </div>
            </div>
            <div v-if="isNewAddress" class="w-full lg:w-4/12 px-4">
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
                  v-model="address.postcode"
                />
              </div>
              <div class="flex">
                <button class="px-4 mr-3 py-1 text-white rounded bg-red-500" @click.prevent="cancleNewAddress"> ยกเลิก </button>
                <button class="px-4 py-1 text-white rounded bg-emerald-500" @click.prevent="addNewAddress"> บันทึก </button>
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
                      style="width:100px; height:60px;" 
                      @click="showPic(product.product_logo)">
                        <img :src="product.product_logo" 
                        :alt="product.product_name" 
                        class="shadow rounded object-cover w-full h-full align-middle border-none" />
                      </div>
                      <span @click="product.product_logo=''" class="px-2 cursor-pointer">X</span>
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
                      <i @click="removeProduct(index)" class="fas fa-trash-alt fa-lg cursor-pointer" style="color: #f93434;"></i>
                    </td>
                  </tr>
                  
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs p-4 whitespace-nowrap bg-blueGray-50 text-blueGray-500 border-blueGray-100"></td>
                  </tr>
                  
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span class="pr-4 font-bold">{{sumVat ? 'ค่าสินค้า/บริการ' : 'ค่าสินค้า/บริการ'}}</span>
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span class="pr-4 font-bold text-emerald-600">
                        {{ sumVat ? formattNumber(sumProductsPrice) : formattNumber(sumProductsPrice-vat) }}
                      </span> บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span class="pr-4 font-bold">ส่วนลด
                        <input
                        type="number"
                        step="0.01"
                        style="width:5rem; height:fit; margin:0;"
                        class="px-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-xs focus:outline-none focus:ring ease-linear transition-all duration-150"
                        v-model="formData.discount"
                      />
                      </span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span class="pr-4 font-bold text-emerald-600">
                        {{ formData.discount }}
                      </span> บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span class="pr-4 font-bold">ราคาหลังหักส่วนลด</span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span v-if="sumVat" class="pr-4 font-bold text-emerald-600">{{ formattNumber(discountedPrice) }}</span> 
                      <span v-if="!sumVat" class="pr-4 font-bold text-emerald-600">{{ formattNumber(sumProductsPrice-vat-formData.discount) }}</span>
                      บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span class="pr-4 font-bold">{{ !sumVat ? 'VAT 7 % (แยก)' : 'VAT 7%'}}
                        <span @click="changeVat" class="ml-3 border px-2 bg-yellow-500 cursor-pointer"> ► </span>
                      </span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span class="pr-4 font-bold text-emerald-600">
                        {{ formattNumber(vat) }} 
                      </span> บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span v-if="sumVat" class="pr-4 font-bold">ราคารวม VAT</span>
                      <span v-if="!sumVat" class="pr-4 font-bold">ราคารวม VAT</span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span v-if="sumVat" class="pr-4 font-bold text-emerald-600">{{ sumProductsPrice!==0 ? formattNumber(discountedPrice+vat) : formattNumber(0) }}</span> 
                      <span v-if="!sumVat" class="pr-4 font-bold text-emerald-600">{{ sumProductsPrice!==0 ? formattNumber(discountedPrice) : formattNumber(0) }}</span>
                      บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <button class="mr-3 px-2 bg-emerald-500" @click.prevent="isDeducate=!isDeducate">•</button>
                      <span class="pr-4 font-bold">หัก ณ ที่จ่าย {{ `${paidVatpercent}%` }}<span @click="changepaidVatpercent" class="ml-3 border px-2 bg-yellow-500 cursor-pointer"> ► </span></span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span v-if="sumVat&&isDeducate" class="pr-4 font-bold text-emerald-600">{{ sumProductsPrice!==0 ? formattNumber(paidVat) : formattNumber(0) }}</span> 
                      <span v-if="!sumVat&&isDeducate" class="pr-4 font-bold text-emerald-600">
                        {{ sumProductsPrice!==0 ? formattNumber(((sumProductsPrice-vat-formData.discount) * paidVatpercent/100)) : formattNumber(0) }}
                      </span>
                      {{ !isDeducate ? '- ' : 'บาท' }}
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                  </tr>
                  <tr>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap py-2">
                      <span class="pr-4 font-bold">ยอดชำระทั้งสิ้น</span>
                    </td>
                    <td class="border-t px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap">
                      <span v-if="sumVat" class="pr-4 font-bold text-emerald-600">{{ 
                        (sumProductsPrice!==0 && isDeducate) ? formattNumber(discountedPrice+vat-paidVat) 
                        : (sumProductsPrice!==0 && !isDeducate) ? formattNumber(discountedPrice+vat) 
                        : formattNumber(0) 
                        }}
                      </span> 
                      <span v-if="!sumVat" class="pr-4 font-bold text-emerald-600">{{ 
                        (sumProductsPrice!==0 && isDeducate) ? formattNumber(discountedPrice-((sumProductsPrice-vat-formData.discount) * paidVatpercent/100)) 
                        : (sumProductsPrice!==0 && !isDeducate) ? formattNumber(discountedPrice) 
                        : formattNumber(0) }}
                      </span> บาท
                    </td>
                    <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap"></td>
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
                  หมายเหตุ
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
            <!-- <button 
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
            type="button"
            @click.prevent="createNewDocument"
            >
              สร้างเอกสาร
            </button> -->
            <DraftReceipt 
            :customer="{
              name: formData?.customer_detail?.customer_name || '-',
              address: formData?.customer_detail?.customer_address || '-',
              taxId: formData?.customer_detail?.tax_id || '-',
            }"
            :receipt="{
              code: predictNextCode(receipt_lastcode) || '-',
              start_date: thaiDate || '-',
              refer: formData.invoice || formData.quotation,
            }"
            :items="formData?.product_detail || []"
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
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  /* eslint-disable */
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import AddProductModal from '@/components/Modals/AddProductModal.vue'
  import PictureModal from '@/components/Modals/PictureModal.vue'
  import SearchQtDropdown from '@/components/Dropdowns/SearchQtDropdown.vue'
  import SearchInDropdown from '@/components/Dropdowns/SearchInDropdown.vue'
  import SearchCustomers from '@/components/Dropdowns/SearchCustomers.vue'
  import DraftReceipt from '@/components/Modals/DraftReceipt.vue'
  
  const edit = ref(true)
  const thaiDate = ref('')
  const receipt_lastcode = ref('')
  const thaiDateDue = ref('')
  const openPicDialog = ref(false)
  const curPicUrl = ref(null)
  const refQuotation = ref(null)
  const refInvoice = ref(null)
  const isNewAddress = ref(false)
  const sumVat = ref(true)
  const paidVatpercent = ref(3)
  const isDeducate = ref(false)
  const isVat = ref(false)

  const img = ref('')

  const headData = ref()

  const discountedPrice = computed(()=>{
    const discounted = 
    (sumVat) ? sumProductsPrice.value - formData.value.discount
    : sumProductsPrice.value - formData.value.discount - vat.value
    return discounted
  })

  const paidVat = computed(()=>{
    const paidVatresult = 
      (sumVat) ? discountedPrice.value * paidVatpercent.value/100 
      : (productVatExac.value-vat.value) * paidVatpercent.value/100
    return paidVatresult
  })

  const formattNumber = (number) => {
    if (isNaN(number)) {
        return "Invalid number";
    }
    return number.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  const refQThandle = (event) => {
    refQuotation.value = event
    formData.value.quotation = event
    if(formData.value.quotation) {
      getRefQuotionData()
    }
  }

  const changeVat = () => {
    if(sumVat.value){
      sumVat.value = false
    } else {
      sumVat.value = true
    }
  }

  const changepaidVatpercent = () => {
    paidVatpercent.value = 
      paidVatpercent.value===3 ? 4
      : paidVatpercent.value===4 ? 5
      : 3
  } 

  const getRefQuotionData = async () => {
    const id = formData.value.quotation || refQuotation.value
    await axios.get(`${process.env.VUE_APP_API_BACKEND}/quotation/getQuotationByQT/${id}`,
      {
        headers: {
          'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
        }
      }
    ).then((response)=>{
      formData.value.product_detail = response.data.data.product_detail
      formData.value.customer_detail.tax_id = response.data.data.customer_detail.tax_id
      formData.value.customer_detail.customer_name = response.data.data.customer_detail.customer_name
      formData.value.customer_detail.customer_lastname = response.data.data.customer_detail.customer_lastname
      formData.value.customer_detail.customer_phone = response.data.data.customer_detail.customer_phone
      formData.value.customer_detail.customer_email = response.data.data.customer_detail.customer_email
      formData.value.customer_detail.customer_address = response.data.data.customer_detail.customer_address
      formData.value.customer_detail.customer_type = response.data.data.customer_detail.customer_type
      formData.value.customer_detail.customer_contact = response.data.data.customer_detail.customer_contact
      formData.value.customer_detail.customer_contact_number = response.data.data.customer_detail.customer_contact_number
      formData.value.ShippingCost = response.data.data.ShippingCost
      formData.value.isVat = response.data.data.isVat
      formData.value.sumVat = response.data.data.sumVat
      formData.value.withholding = response.data.data.withholding
    }).catch((error)=>{
      console.log(error.response.data.message)
      console.log(error)
    })
  }

  const refINhandle = (event) => {
    refInvoice.value = event
    formData.value.invoice = event
  }

const handleFileChange = (event, index) => {
const fileInput = event.target
const file = fileInput.files[0]
  if (file) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        formData.value.product_detail[index].product_logo = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please choose an image file.')
    }
  }
}

const sumProductsPrice = computed(()=>{
  const prices_list = formData.value.product_detail.map((product)=>{
    return product.product_price * product.product_amount
  })
  const sumPrices = (prices_list.length > 0) ? prices_list.reduce((a,b)=> a + b) : 0
  return sumPrices
})

const vat = computed(()=>{
  let vat7 = null
  if(sumVat.value){
    vat7 = (sumProductsPrice.value !== 0) ? (discountedPrice.value)*0.07 : 0
  } else {
    vat7 = (sumProductsPrice.value !== 0) ? (sumProductsPrice.value)*7/107 : 0
  }
  return vat7
})

const productVatExac = computed(()=>{
  if(!sumVat.value){
    return (sumProductsPrice.value !== 0) ? (sumProductsPrice.value-vat.value-formData.discount) : 0
  } else {
    return 0
  }
})

const getHeader = async () => {
  const id = localStorage.getItem('headerId')
  await axios.get(`${process.env.VUE_APP_API_BACKEND}/Company/getCompanyBy/${id}`,
    {
      headers: {
        'auth-token': process.env.VUE_APP_AUTH_TOKEN_ADMIN
      }
    }
  ).then((response) => {
    if(response.data.status){
      console.log(response.data)
      headData.value = response.data.data
      console.log(headData.value)
      localStorage.setItem('headerId', response.data.data._id)
    }
  }).catch((error) => {
    console.error(error)
    console.log(error.response.data.message)
  })
}

const removeProduct = (index) => {
  formData.value.product_detail.splice(index, 1)
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

  const refCThandle = (event) => {
    const refCustomer = event
    formData.value.customer_number = refCustomer.customer_number
    formData.value.customer_detail.tax_id = refCustomer.customer_taxnumber
    formData.value.customer_detail.customer_name = refCustomer.customer_name
    formData.value.customer_detail.customer_lastname = refCustomer.customer_lastname
    formData.value.customer_detail.customer_phone = refCustomer.customer_phone
    formData.value.customer_detail.customer_email = refCustomer.customer_email
    formData.value.customer_detail.customer_address = refCustomer.customer_position
    formData.value.customer_detail.customer_type = refCustomer.customer_type
    formData.value.customer_detail.customer_contact = refCustomer.customer_contact
    formData.value.customer_detail.customer_contact_number = refCustomer.customer_contact_number
  }

  const formData = ref({
    customer_branch: {
      Branch_company_name: "สวนสวยการ์เด้นคอร์เปอเรชั่น",
      Branch_company_number: "0-1055-66228-53-5",
      Branch_company_address: "146 ถนนจอมทองบูรณะ แขวงบางมด เขตบางมด กรุงเทพมหานคร 10150"
    },
    invoice: null,
    quotation: null,
    customer_number: null,
    customer_detail: {
      tax_id: null,
      customer_name: null,
      customer_lastname: null,
      customer_phone: null,
      customer_email: null,
      customer_address: null,
      customer_type: null,
      customer_contact: null,
      customer_contact_number: null,
    },
    product_detail: [],
    ShippingCost: 0,
    start_date: null,
    end_date: null,
    note: "",
    discount: 0,
    percen_deducted: null,
    percen_payment: null,
    signatureID: null,
    isVat: true,
    sumVat: true,
    withholding: false,
  })

  const addProducts = (value) => {
    formData.value.product_detail.push(value)
    console.log(formData.value.product_detail)
  }

  const customerFullName = computed(()=>{
    const first = (formData.value.customer_detail.customer_name) ? formData.value.customer_detail.customer_name : ''
    const last = (formData.value.customer_detail.customer_lastname) ? formData.value.customer_detail.customer_lastname : ''
    return `${first} ${last}`
  })

  const addNewAddress = () => {
    formData.value.customer_detail.customer_address = 
    `${address.value.houseNo} ${address.value.subdistrict} ${address.value.district} ${address.value.province} ${address.value.postcode}`
    address.value.houseNo = ''
    address.value.subdistrict = ''
    address.value.district = ''
    address.value.province = ''
    address.value.postcode = ''
    isNewAddress.value = false
  }

  const cancleNewAddress = () => {
    address.value.houseNo = ''
    address.value.subdistrict = ''
    address.value.district = ''
    address.value.province = ''
    address.value.postcode = ''
    isNewAddress.value = false
  }

  onMounted(()=>{
    getHeader()
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
      //formData.value.customer_detail.customer_address = customerFullAddress.value
      formData.value.start_date = thaiDate.value
      formData.value.end_date = thaiDateDue.value
      formData.value.discount = parseFloat(formData.value.discount)
      formData.value.percen_deducted = paidVatpercent.value
      formData.value.percen_payment = paidVatpercent.value
      formData.value.sumVat = sumVat.value
      formData.value.withholding = isDeducate.value
      formData.value.isVat = headData.value.isVat
      formData.value.product_detail.forEach((product)=>{
        product.product_logo = ''
      })
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

  
  