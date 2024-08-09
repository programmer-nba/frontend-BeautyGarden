<template>
  <Toast />
  <ConfirmPopup></ConfirmPopup>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <div class="flex flex-col justify-center gap-y-2 items-center">
          <div class="flex flex-wrap w-full gap-3 items-center">
            <Dropdown
              v-if="edit || newData"
              v-model="logo"
              :options="logos"
              optionLabel=""
              placeholder="เลือกโลโก้"
              class="w-36"
              @change="changeLogo"
            >
              <template #value="slotProps">
                <div
                  v-if="slotProps.value && slotProps.value.profile_image !== '-'"
                  class="flex align-items-center"
                >
                  <img
                    :alt="slotProps.value?._id"
                    :src="`https://drive.google.com/thumbnail?id=${slotProps.value?.profile_image}`"
                    :class="`mr-2 flag`"
                    style="width: 75px"
                  />
                </div>
              </template>
              <template #option="slotProps">
                <div class="flex align-items-center">
                  <img
                    :alt="slotProps.option?._id"
                    :src="`https://drive.google.com/thumbnail?id=${slotProps.option?.profile_image}`"
                    :class="`mr-2 flag`"
                    style="width: 75px"
                  />
                </div>
              </template>
            </Dropdown>
            <Button v-if="edit || newData" label="ลบ" class="text-red-500 pr-3" @click="removeLogo" />
            <div class="flex gap-2 justify-center items-center" v-if="edit || newData">
              <img
                v-if="logoPreview"
                class="w-[65px] h-[65px] rounded"
                :src="logoPreview"
                alt="..."
              />
              <input type="file" placeholder="เลือกโลโก้" @change="uploadLogoHandle" />
              <Button
                label="อัพโหลดรูป Logo"
                class="border border-yellow-600 text-yellow-600 rounded px-2 py-1"
                :loading="loading"
                @click="uploadNewLogo"
              />
            </div>
            <Dropdown
              v-if="!newData"
              @change="getBanks"
              v-model="headData"
              :options="headDatas"
              optionLabel="Branch_company_name"
              placeholder="เลือกหัวเอกสาร"
              checkmark
              :highlightOnSelect="false"
              class="w-48 border border-green-500"
            />

            <div class="flex gap-2 items-center border-l pl-3">
              <Image
                v-if="
                  headData.Branch_iden_number &&
                  headData.Branch_iden_number &&
                  headData.Branch_iden_number !== '-'
                "
                :src="`https://drive.google.com/thumbnail?id=${headData.Branch_iden_number}`"
                class="rounded-full"
                alt="Image"
                width="75"
                preview
              />
              <h6 class="text-blueGray-700 text-xl font-bold">
                {{ headData.Branch_company_name }}
                {{ headData.Branch_iden ? `(${headData.Branch_iden})` : "" }}
                <span
                  :class="
                    headData.isVat
                      ? 'px-2 mx-2 rounded-xl text-sm bg-yellow-300 text-orange-600'
                      : ''
                  "
                  >{{ headData.isVat ? "VAT" : "" }}</span
                >
              </h6>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <Button
            class="bg-sky-500 w-[200px] text-white active:bg-yellow-600 font-bold uppercase text-md px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            label="เพิ่มข้อมูลใหม่"
            @click.prevent="clearHeadData()"
            v-if="!newData && !edit"
            :loading="loading"
          />

          <Button
            class="bg-yellow-500 w-[200px] text-white active:bg-yellow-600 font-bold uppercase text-md px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            label="แก้ไขข้อมูล"
            @click.prevent="isEdit()"
            :loading="loading"
            v-if="!edit && headData.Branch_company_name && !newData"
          />
          <Button
            class="bg-red-500 w-[200px] text-white active:bg-red-600 font-bold uppercase text-md px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            label="ลบข้อมูล"
            :loading="loading"
            @click.prevent="toDeleteCurCompany($event, headData._id)"
            v-if="!edit && headData.Branch_company_name && !newData"
          />
        </div>

        <div class="flex gap-2" v-if="edit && !newData">
          <Button
            class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-md px-4 py-2 w-[100px] rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            :loading="loading"
            label="ยกเลิก"
            @click.prevent="()=>{
              edit = false;
              this.$router.go(0)
            }"
          />
          <Button
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase w-[100px] text-md px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            label="แก้ไข"
            :loading="loading"
            @click.prevent="editHeadData(headData._id)"
          />
        </div>
        <div class="flex gap-2" v-if="newData && !edit">
          <Button
            class="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-md px-4 py-2 w-[100px] rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            :loading="loading"
            label="ยกเลิก"
            @click.prevent="cancleNew"
          />
          <Button
            class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase w-[100px] text-md px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
            label="เพิ่ม"
            :loading="loading"
            @click.prevent="createHeadData"
          />
        </div>
      </div>
    </div>
    <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
      <form>
        <h6 class="text-blueGray-400 text-md mt-3 mb-6 font-bold uppercase">ข้อมูล</h6>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <div class="flex gap-2">
                <span class="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  ชื่อกิจการ / บริษัท
                </span>
              </div>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.Branch_company_name"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <div class="flex gap-2">
                <span class="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  เลขที่สาขา/สำนักงานใหญ่
                </span>
                <InputSwitch
                  v-if="edit || newData"
                  @change="changeBranch"
                  v-model="isMain"
                />
              </div>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.Branch_iden"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <div class="flex gap-2">
                <span class="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  เลขประจำตัวผู้เสียภาษี
                </span>
                <span class="block uppercase text-blueGray-600 text-md font-bold mb-2">
                  VAT :
                </span>
                <InputSwitch v-if="edit" v-model="headData.isVat" />
              </div>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.taxnumber"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                htmlFor="grid-password"
              >
                อีเมล์
              </label>
              <input
                type="email"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.company_email"
              />
            </div>
          </div>
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                htmlFor="grid-password"
              >
                โทรศัพท์
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.Branch_company_number"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="w-full lg:w-12/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                htmlFor="grid-password"
              >
                ที่อยู่
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.Branch_company_address"
              />
            </div>
          </div>
        </div>

        <div class="flex">
          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-xd font-bold mb-2"
                htmlFor="grid-password"
              >
                ชื่อผู้ติดต่อ
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.contact_name"
              />
            </div>
          </div>

          <div class="w-full lg:w-6/12 px-4">
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                htmlFor="grid-password"
              >
                เบอร์ผู้ติดต่อ
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                :disabled="!edit && !newData"
                v-model="headData.contact_number"
              />
            </div>
          </div>
        </div>
        <div class="flex gap-2 items-center my-3">
          <h1 class="text-md font-semibold">บัญชีธนาคาร</h1>
        </div>
        <div class="flex flex-col">
          <div class="flex" v-for="(account, aIndex) in banks" :key="aIndex">
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <div class="flex gap-2 items-center mb-2">
                  <span class="block uppercase text-blueGray-600 text-md font-bold">
                    ชื่อบัญชี
                  </span>
                </div>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="account.name"
                />
              </div>
            </div>

            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                  htmlFor="grid-password"
                >
                  เลขบัญชี
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="account.number"
                />
              </div>
            </div>

            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-md font-bold mb-2"
                  htmlFor="grid-password"
                >
                  ธนาคาร
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="account.remark"
                />
              </div>
            </div>
            <Button icon="pi pi-times" class="text-red-500" @click="removeBank(aIndex)" />
          </div>
          <div
            v-if="edit || newData"
            class="flex items-center justify-center mt-3 border-t pt-3"
          >
            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <div class="flex gap-2 items-center mb-2">
                  <span
                    class="block uppercase text-blueGray-600 text-md font-bold text-green-500"
                  >
                    ชื่อบัญชี
                  </span>
                </div>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="bank.name"
                />
              </div>
            </div>

            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-md font-bold mb-2 text-green-500"
                >
                  เลขบัญชี
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="bank.number"
                />
              </div>
            </div>

            <div class="w-full lg:w-6/12 px-4">
              <div class="relative w-full mb-3">
                <label
                  class="block uppercase text-blueGray-600 text-md font-bold mb-2 text-green-500"
                >
                  ธนาคาร
                </label>
                <input
                  type="text"
                  class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 rounded text-md shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  :class="{ 'border-0': !edit && !newData, 'bg-white border-1': edit }"
                  :disabled="!edit && !newData"
                  v-model="bank.remark"
                />
              </div>
            </div>
            <Button
              label="เพิ่ม"
              @click="addBank"
              class="px-2 pt-3 m-0 rounded-md text-green-500"
            />
          </div>
        </div>

        <h1 class="font-semibold py-4">ลายเซ็น</h1>
        <div v-if="headData.Branch_company_name" class="flex gap-4">
          <div
            v-for="(signature, index) in signatures"
            class="flex flex-col items-center justify-center"
            :key="index"
          >
            <div class="flex flex-col items-center justify-center">
              <img
                v-if="
                  signature.image_signature &&
                  signature.image_signature.trim() !== '' &&
                  signature.image_signature.trim() !== '-'
                "
                :alt="index"
                :src="`https://drive.google.com/thumbnail?id=${signature.image_signature}`"
                class="w-[75px] pb-3"
              />
              <p
                v-if="
                  !signature.image_signature ||
                  signature.image_signature.trim() === '' ||
                  signature.image_signature.trim() === '-'
                "
                class="pb-3"
              >
                .................
              </p>
              <div class="flex gap-2 items-center justify-center">
                <p>ชื่อ</p>
                <p
                  v-if="
                    signature.name &&
                    signature.name.trim() !== '-' &&
                    signature.name.trim() !== ''
                  "
                >
                  {{ signature.name }}
                </p>
                <p
                  v-if="
                    !signature.name ||
                    signature.name.trim() === '-' ||
                    signature.name.trim() === ''
                  "
                >
                  ..............
                </p>
              </div>
              <div class="flex gap-2 items-center justify-center">
                <p>ตำแหน่ง</p>
                <p
                  v-if="
                    signature.position &&
                    signature.position.trim() !== '-' &&
                    signature.position.trim() !== ''
                  "
                >
                  {{ signature.position }}
                </p>
                <p
                  v-if="
                    !signature.position ||
                    signature.position.trim() === '-' ||
                    signature.position.trim() === ''
                  "
                >
                  ..............
                </p>
              </div>
            </div>
            <Button
              v-if="edit"
              :loading="loading"
              @click="toDeleteSign($event, signature._id)"
              label="ลบ"
              outlined
              class="text-red-500 hover:bg-red-200"
            ></Button>
          </div>
          <Button
            v-if="edit"
            size="small"
            icon="pi pi-plus"
            class="hover:bg-white rounded-full mt-1 border-green-500 border-2 px-5 ml-5 w-[70px] h-[70px]"
            @click="openAddSign = true"
          />
        </div>
      </form>
    </div>
  </div>

  <Dialog
    v-model:visible="openAddSign"
    modal
    header="เพิ่มลายเซ็นใหม่"
    :style="{ width: '25rem' }"
  >
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">ชื่อ : </label>
      <InputText
        id="name"
        class="flex-auto px-2 ml-2 border-b"
        autocomplete="off"
        v-model="signature.name"
      />
    </div>
    <div class="flex align-items-center gap-3 mb-5">
      <label for="position" class="font-semibold w-6rem">ตำแหน่ง : </label>
      <InputText
        id="position"
        class="flex-auto px-2 ml-2 border-b"
        autocomplete="off"
        v-model="signature.position"
      />
    </div>
    <div>
      <div class="w-full flex justify-end">
        <Button
          v-if="previewSign"
          size="small"
          icon="pi pi-times"
          class="text-red-500 relative hover:font-bold -bottom-16"
          @click="previewSign = null"
        />
      </div>
      <div v-if="previewSign" class="card flex justify-center">
        <Image :src="previewSign" alt="Image" width="250" preview />
      </div>
    </div>

    <div class="card flex justify-center">
      <FileUpload
        class="p-fileupload-file-remove"
        mode="basic"
        name="demo[]"
        :auto="true"
        accept="image/*"
        customUpload
        @uploader="customBase64Uploader"
      />
    </div>
    <div class="flex justify-center gap-2 mt-5">
      <Button
        :loading="loading"
        label="ยกเลิก"
        @click="openAddSign = false"
        class="px-2 text-red-400 hover:bg-red-200"
      />
      <Button
        :loading="loading"
        label="บันทึก"
        @click="addSign"
        class="px-2 text-green-700 hover:bg-green-200"
      />
    </div>
  </Dialog>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import { Company } from "@/service/Company";

onMounted(() => {
  getHeaders().then(() => {
    headData.value = headDatas.value[0];
    banks.value = headDatas.value[0].bank;
    logo.value = null;
    if (headData.value.Branch_iden.trim() === "สำนักงานใหญ่") {
      isMain.value = true;
    } else {
      isMain.value = false;
    }
  });
  getSignatures();
  getLogos();
});

const logos = ref([]);
const logo = ref();
const confirm = useConfirm();
const toast = useToast();
const loading = ref(false);
const headData = ref({});
const headDatas = ref([]);
const edit = ref(false);
const isMain = ref(true);
const signatures = ref([]);
const signature = ref({});
const openAddSign = ref(false);
const previewSign = ref();
const banks = ref([]);
const bank = ref({});
const newData = ref(false);
const logoPreview = ref();
const logoUpload = ref();

const uploadLogoHandle = (event) => {
  const file = event.target.files[0];
  logoUpload.value = file;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result;
      logoPreview.value = fileContent;
      console.log("File content:", logoPreview.value);
    };
    reader.readAsDataURL(file);
  }
};

const removeLogo = async () => {
  console.log(logo.value.profile_image)
  console.log(logos.value)
  const id = logos.value.find(i=>i.profile_image===logo.value.profile_image)._id
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/Company/deleteImgBy/${id}`,
      {
        headers: {
          'auth-token' : localStorage.getItem("ssgdToken")
        }
      }
    )
    if(response.data){
      console.log(response.data)
      getLogos();
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบ logo แล้ว",
        life: 3000,
      });
      logo.value = null
    }
  }
  catch(err){
    console.log(err)
    getLogos();
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบ logo ไม่สำเร็จ",
      life: 3000,
    });
  }
}

const uploadNewLogo = async () => {
  if(!logoUpload.value){
    toast.add({
      severity: "error",
      summary: "กรุณาเลือกไฟล์",
      detail: "เพิ่ม logo ไม่สำเร็จ",
      life: 3000,
    });
    return
  }
  loading.value = true;
  const formData = new FormData();
  formData.append("imgCollection", logoUpload.value);
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/Company/InsertImg`,
      formData,
      {
        headers: {
          "auth-token": localStorage.getItem("ssgdToken"),
          "Content-types": "multipart/form-data",
        },
      }
    );
    if (response.data) {
      getHeaders().then(() => {
        headData.value = headDatas.value[0];
        banks.value = headDatas.value[0].bank;
        logo.value = null;
        if (headData.value.Branch_iden.trim() === "สำนักงานใหญ่") {
          isMain.value = true;
        } else {
          isMain.value = false;
        }
      });
      getSignatures();
      getLogos();
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "เพิ่ม logo ใหม่แล้ว",
        life: 3000,
      });
      console.log(response.data);
    }
  } catch (err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "เพิ่ม logo ไม่สำเร็จ",
      life: 3000,
    });
  } finally {
    loading.value = false;
    newData.value = false;
  }
};

const cancleNew = () => {
  headData.value = headDatas.value[0];
  newData.value = false;
};

const changeLogo = () => {
  headData.value.Branch_iden_number = logo.value.profile_image;
};

const changeBranch = () => {
  if (isMain.value) {
    headData.value.Branch_iden = "สำนักงานใหญ่";
  } else {
    headData.value.Branch_iden = null;
  }
};

const toDeleteSign = (event, id) => {
  console.log(id);
  confirm.require({
    target: event.currentTarget,
    message: "ต้องการลบลายเซ็นนี้หรือใหม่ ?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm px-2",
    acceptClass: "p-button-danger p-button-sm px-2 text-red-500",
    rejectLabel: "ยกเลิก",
    acceptLabel: "ลบ",
    accept: () => {
      deleteSign(id);
    },
    reject: () => {},
  });
};

const toDeleteCurCompany = (event, id) => {
  console.log(id);
  confirm.require({
    target: event.currentTarget,
    message: "ต้องการลบหัวข้อนี้หรือใหม่ ?",
    icon: "pi pi-info-circle",
    rejectClass: "p-button-secondary p-button-outlined p-button-sm px-2",
    acceptClass: "p-button-danger p-button-sm px-2 text-red-500",
    rejectLabel: "ยกเลิก",
    acceptLabel: "ลบ",
    accept: () => {
      deleteCurCompany(id);
    },
    reject: () => {},
  });
};

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob());
  signature.value.imgCollection = file;
  reader.readAsDataURL(blob);
  reader.onloadend = function () {
    const base64data = reader.result;
    previewSign.value = base64data;
  };
};

const isEdit = () => {
  edit.value = true;
};

const addSign = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("imgCollection", signature.value.imgCollection);
  formData.append("name", signature.value.name);
  formData.append("position", signature.value.position);
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/signature/create`,
      formData,
      {
        headers: {
          "auth-token": localStorage.getItem("ssgdToken"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data) {
      console.log(response.data);
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "คุณเพิ่มลายเซ็นใหม่แล้ว",
        group: "br",
        life: 3000,
      });
      loading.value = false;
      openAddSign.value = false;
      signature.value = {};
      previewSign.value = null;
      getSignatures();
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "เพิ่มลายเซ็นใหม่ล้มเหลว",
      life: 3000,
    });
  }
};

const deleteSign = async (id) => {
  loading.value = true;
  //const id = signature.value._id
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/signature/deleteSugnature/${id}`,
      {
        headers: {
          "auth-token": localStorage.getItem("ssgdToken"),
        },
      }
    );
    if (response.data) {
      console.log(response.data);
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบลายเซ็นแล้ว",
        group: "br",
        life: 3000,
      });
      loading.value = false;
      openAddSign.value = false;
      signature.value = {};
      getSignatures();
    }
  } catch (err) {
    loading.value = false;
    console.log(err);
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบลายเซ็นล้มเหลว",
      life: 3000,
    });
  }
};

const editHeadData = async (id) => {
  loading.value = true;
  const body = {
    bank: banks.value,
    taxnumber: headData.value.taxnumber,
    Branch_iden: headData.value.Branch_iden,
    Branch_iden_number: logo.value?.profile_image || '-',
    Branch_company_name: headData.value.Branch_company_name,
    Branch_company_number: headData.value.Branch_company_number,
    Branch_company_address: headData.value.Branch_company_address,
    contact_name: headData.value.contact_name,
    contact_number: headData.value.contact_number,
    company_email: headData.value.company_email,
    isVat: headData.value.isVat,
    detail: headData.value.detail,
  };
  await axios
    .put(`${import.meta.env.VITE_API_URL}/Company/EditCompany/${id}`, body, {
      headers: {
        "auth-token": localStorage.getItem("ssgdToken"),
      },
    })
    .then(async (response) => {
      if (response.data) {
        loading.value = false;
        console.log(response.data.message);
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "คุณแก้ไขข้อมูลสำเร็จ",
          group: "br",
          life: 3000,
        });
        edit.value = false;
        getHeaders().then(() => {
          headData.value = headDatas.value[0];
          banks.value = headDatas.value[0].bank;
          logo.value = null;
          if (headData.value.Branch_iden.trim() === "สำนักงานใหญ่") {
            isMain.value = true;
          } else {
            isMain.value = false;
          }
        });
        getSignatures();
        getLogos();
      }
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "แก้ไขข้อมูลไม่สำเร็จ",
        group: "br",
        life: 3000,
      });
      edit.value = false;
      getHeaders().then(() => {
        headData.value = headDatas.value[0];
        banks.value = headDatas.value[0].bank;
        logo.value = null;
        if (headData.value.Branch_iden.trim() === "สำนักงานใหญ่") {
          isMain.value = true;
        } else {
          isMain.value = false;
        }
      });
      getSignatures();
      getLogos();
    });
};

const clearHeadData = () => {
  headData.value = {};
  isMain.value = false;
  banks.value = [];
  newData.value = true;
};

const addBank = () => {
  banks.value.push(bank.value);
  bank.value = {};
};

const removeBank = (index) => {
  banks.value.splice(index, 1);
};

const getBanks = () => {
  banks.value = headData.value.bank;
};

const createHeadData = async () => {
  loading.value = true;
  const body = {
    bank: banks.value,
    taxnumber: headData.value.taxnumber,
    Branch_iden: headData.value.Branch_iden,
    Branch_iden_number: headData.value.Branch_iden_number,
    Branch_company_name: headData.value.Branch_company_name,
    Branch_company_number: headData.value.Branch_company_number,
    Branch_company_address: headData.value.Branch_company_address,
    contact_name: headData.value.contact_name,
    contact_number: headData.value.contact_number,
    company_email: headData.value.company_email,
    isVat: headData.value.isVat,
    detail: headData.value.detail,
  };
  await axios
    .post(`${import.meta.env.VITE_API_URL}/Company/createCompany`, body, {
      headers: {
        "auth-token": localStorage.getItem("ssgdToken"),
      },
    })
    .then((response) => {
      if (response.data) {
        loading.value = false;
        console.log(response.data.message);
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: "เพิ่มข้อมูลสำเร็จ",
          group: "br",
          life: 3000,
        });
        edit.value = false;
        getHeaders();
      }
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด",
        detail: "เพิ่มมูลไม่สำเร็จ",
        group: "br",
        life: 3000,
      });
      edit.value = false;
      getHeaders();
    });
};

const getHeaders = async () => {
  await axios
    .get(`${import.meta.env.VITE_API_URL}/Company/getCompannyAll`, {
      headers: {
        "auth-token": localStorage.getItem("ssgdToken"),
      },
    })
    .then(async (response) => {
      if (response.data.status) {
        console.log(response.data);
        headDatas.value = response.data.data;
        logo.value = headDatas.value[0].Branch_iden_number;
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.data.message);
    });
};

const getLogos = async () => {
  await axios
    .get(`${import.meta.env.VITE_API_URL}/Company/getImgAll`, {
      headers: {
        "auth-token": localStorage.getItem("ssgdToken"),
      },
    })
    .then(async (response) => {
      if (response.data.status) {
        console.log(response.data);
        logos.value = response.data.data;
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.data.message);
    });
};

const getSignatures = async () => {
  await axios
    .get(`${import.meta.env.VITE_API_URL}/signature/getSugnatureAlls`, {
      headers: {
        "auth-token": localStorage.getItem("ssgdToken"),
      },
    })
    .then(async (response) => {
      if (response.data.status) {
        console.log(response.data);
        signatures.value = response.data.data;
      }
    })
    .catch((error) => {
      console.error(error);
      console.log(error.response.data.message);
    });
};

const deleteCurCompany = async (id) => {
  loading.value = true;
  try {
    const response = await Company.deleteCompany(id);
    if (response) {
      console.log(response);
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "ลบข้อมูลแล้ว",
        group: "br",
        life: 3000,
      });
      loading.value = false;
      getHeaders().then(() => {
        headData.value = headDatas.value[0];
        banks.value = headDatas.value[0].bank;
        if (headData.value.Branch_iden.trim() === "สำนักงานใหญ่") {
          isMain.value = true;
        } else {
          isMain.value = false;
        }
      });
    }
  } catch (err) {
    conole.log(err);
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบข้อมูลไม่สำเร็จ",
      group: "br",
      life: 3000,
    });
    loading.value = false;
  }
};
</script>
<style scoped></style>
