<template>
    <div>
      <!-- <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
        Open regular modal
      </button> -->
      <div style="background-color:rgba(0, 0, 0, 0.459);" class="overflow-x-hidden top-95-px mx-4 px-6 overflow-y-auto fixed rounded inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
        <div class="relative w-full my-6 mx-auto">
          <!--content-->
          <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <!--header-->
            <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
              <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="toggleClose">
                <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                  <span class="opacity-0">--------------------------</span>×
                </span>
              </button>
            </div>

            <!--body-->
            <div class="relative p-6 flex-auto">
              <div class="w-full px-4">
                <div class="relative w-full mb-3 mt-2">
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    รายละเอียดสินค้า/บริการ
                  </label>
                  <input
                    type="text"
                    class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    v-model="curProduct.product_name"
                  />
                </div>
              </div>
              <div class="w-full px-4">
                <div class="relative w-full mb-3">
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    จำนวน
                  </label>
                  <input
                    type="number"
                    class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    v-model="curProduct.product_amount"
                  />
                </div>
              </div>
              
              <div class="w-full px-4">
                <div class="relative w-full mb-3">
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                   ราคาต่อหน่วย
                  </label>
                  <input
                    type="number"
                    class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    v-model="curProduct.product_price"
                  />
                </div>
              </div>
              <div class="w-full px-4">
                <div class="relative w-full mb-3">
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    ราคารวม
                  </label>
                  <input
                    type="number"
                    class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    v-model="productTotal"
                    disabled
                  />
                </div>
              </div>
              <div class="w-full px-4">
                <div class="relative w-full mb-3">
                  <label
                    class="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    หมายเหตุ
                  </label>
                  <input
                    type="text"
                    class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  />
                </div>
              </div>
            </div>

            <!--footer-->
            <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
              <button 
              class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
              type="button" 
              v-on:click="toggleClose()">
                ยกเลิก
              </button>
              <button 
              class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" 
              type="button" 
              v-on:click="submitProduct()"
              >
                ยืนยัน
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
/* eslint-disable */
import { ref, defineEmit, computed } from 'vue'

const emit = defineEmit(['closeModal', 'addToProduct'])

const curProduct = ref({
    product_name: "",
    product_price: null,
    product_amount: null,
    product_logo: "",
    product_total: ""
  })

const productTotal = computed(()=>{
  return (curProduct.value.product_price && curProduct.value.product_amount) 
    ? (curProduct.value.product_price*curProduct.value.product_amount)
    : 0
})

const submitProduct = () => {
  emit('addToProduct', curProduct.value)
  emit('closeModal')
}

const toggleClose = () => {
  emit('closeModal')
}
</script>