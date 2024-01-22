<template>
  <div
    class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0"
  >
    <div class="rounded-t bg-white mb-0 px-6 py-6">
      <div class="text-center flex justify-between">
        <h6 class="text-blueGray-700 text-xl font-bold">บ้านสวนสวยการ์เด้นคอร์เปอเรชั่น (สำนักงานใหญ่)</h6>
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
                value="บ้านสวนสวยการ์เด้นคอร์เปอเรชั่น"
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
                เลขประจำตัวผู้เสียภาษี (TAX ID)
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="0-1055-66228-53-5"
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
                อีเมล์
              </label>
              <input
                type="email"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="บ้านสวนสวยการ์เด้น@gmail.com"
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
                โทรศัพท์
              </label>
              <input
                type="text"
                class="px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                value="099-9999999"
                :class="{ 'border-0': !edit, 'bg-white border-1': edit }"
                :disabled="!edit"
              />
            </div>
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          ข้อมูลร้านค้า
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
                value="146 ถนนจอมทองบูรณะ แขวงบางมด เขตบางมด กรุงเทพมหานคร 10150"
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
          </div>
        </div>

        <hr class="mt-6 border-b-1 border-blueGray-300" />

        <h6 class="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
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
              >
                    ให้บริการตัดแต่งสวน และจำหน่ายอุปกรณ์ตกแต่งสวน
                  </textarea
              >
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const edit = ref(false)

// eslint-disable-next-line no-unused-vars
const isEdit = () => {
  edit.value = true
}
</script>

