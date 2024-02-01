<template>
  <div>
    <button  @click="openModal" class="px-4 py-2 text-white rounded bg-orange-500">เพิ่ม <i class="fas fa-plus-circle"></i></button>
    <!-- Dialog Modal -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <div class="flex justify-center items-center">
            <h2>เพิ่มข้อมูลลูกค้าใหม่</h2>
        </div>
        <form class="flex flex-col" @submit.prevent="createCustomer">

        <div class="py-2 my-3">
            <label for="customerImg">รูปลูกค้า :</label>
            <input
                type="file"
                id="customerImg"
                @change="imgInputHandle"
            />
        </div>
          <div v-if="formData.imgPreview" style="width:200px;" class="border flex items-start justify-items-center">
            <img  class="object-cover" :src="formData.imgPreview" alt="..."/>
            <button class="mx-3 text-red-500" @click="removePic">X</button>
          </div>
          
          <label for="customerName">ชื่อลูกค้า :</label>
          <input v-model="formData.customerName" type="text" id="customerName" required />

          <label for="customerTaxNumber">เลขประจำตัวผู้เสียภาษี TAX ID:</label>
          <input
            v-model="formData.customerTaxNumber"
            type="text"
            id="customerTaxNumber"
          />
          
          <label for="customerLastName"><span class="px-2 cursor-pointer" :class="[{ 'text-emerald-500': formData.customerLastName!=='สำนักงานใหญ่' }]" @click.prevent="isMainCompany(false)">สาขา</span>/<span :class="[{ 'text-emerald-500': formData.customerLastName==='สำนักงานใหญ่' }]" class="px-2 cursor-pointer" @click.prevent="isMainCompany(true)">สำนักงานใหญ่</span></label>
          <input
            v-model="formData.customerLastName"
            type="text"
            id="customerLastName"
          />

          <label for="customerPosition">ที่อยู่ Address :</label>
          <input
            v-model="formData.customerPosition"
            type="text"
            id="customerPosition"
          />

          <label for="customerPhone">โทร Tel :</label>
          <input
            v-model="formData.customerPhone"
            type="text"
            id="customerPhone"
          />

          <label for="customerEmail">อีเมล์ Email:</label>
          <input
            v-model="formData.customerEmail"
            type="email"
            id="customerEmail"
          />

          <label for="customerContactName">ผู้ติดต่อ :</label>
          <input
            v-model="formData.customerContactName"
            type="text"
            id="customerContactName"
          />

          <label for="customerContactPhone">เบอร์ผู้ติดต่อ :</label>
          <input
            v-model="formData.customerContactPhone"
            type="text"
            id="customerContactPhone"
          />

          <label for="customerType">ประเภทลูกค้า :</label>
          <input
            v-model="formData.customerType"
            type="text"
            id="customerType"
          />

          <div class="flex py-2 my-3 justify-center">
            <button class="px-2 mx-4 rounded bg-red-500 text-white" @click="closeModal">ยกเลิก</button>
            <button class="px-2 mx-4 rounded bg-emerald-500 text-white" type="submit">เพิ่มลูกค้าใหม่</button>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import axios from "axios";
import { ref, defineEmit } from "vue";

const isModalOpen = ref(false);
const formData = ref({
  customerName: null,
  customerLastName: null,
  customerPhone: null,
  customerPosition: null,
  customerTaxNumber: null,
  customerContactName: null,
  customerContactPhone: null,
  customerType: null,
  customerEmail: null,
  customerImg: null,
  imgPreview: null
});

const isMainCompany = (value) => {
    if(value){
        formData.value.customerLastName = 'สำนักงานใหญ่'
    } else {
        formData.value.customerLastName = ''
    }
}

const openModal = () => {
  isModalOpen.value = true;
};

const removePic = () => {
    formData.value.customerImg = null
    formData.value.imgPreview = null
}

const imgInputHandle = (event) => {
    if(event.target.files.length > 0){
        const file = event.target.files[0]
        formData.value.customerImg = file
        console.log('file', file)

        const reader = new FileReader()
        reader.onload = () => {
            formData.value.imgPreview = reader.result;
        }
        reader.readAsDataURL(file);
    }
}

const closeModal = () => {
  isModalOpen.value = false;
};

const emit = defineEmit(['refreshData'])

const createCustomer = async () => {
    const formDatas = new FormData()
    formDatas.append('imgCollection', formData.value.customerImg)
    formDatas.append('customer_name', formData.value.customerName)
    formDatas.append('customer_lastname', formData.value.customerLastName)
    formDatas.append('customer_phone', formData.value.customerPhone)
    formDatas.append('customer_position', formData.value.customerPosition)
    formDatas.append('customer_taxnumber', formData.value.customerTaxNumber)
    formDatas.append('customer_email', formData.value.customerEmail)
    formDatas.append('customer_contact', formData.value.customerContactName)
    formDatas.append('customer_contact_number', formData.value.customerContactPhone)
    formDatas.append('customer_type', formData.value.customerType)
    console.log([...formDatas])
    await axios.post(`${process.env.VUE_APP_API_BACKEND}/customer/create`, formDatas,
    {
        headers: {
            'auth-token' : process.env.VUE_APP_AUTH_TOKEN_ADMIN,
            'Content-Type': 'multipart/form-data',
        }
    }).then((response)=>{
        console.log(response.data)
    }).catch((err)=>{
        console.log(err)
    })

    // Close the modal after creating the customer
    closeModal();
    emit('refreshData')
};
</script>

<style scoped>
/* Styles for the modal */
.modal {
  display: none;
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex; /* Center horizontally */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

.modal-content {
  background-color: #fefefe;
  padding: 50px;
  border: 1px solid #888;
  width: 80%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.close {
  color: #cf0000;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

