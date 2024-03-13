<template>
    <div>
      <Toast />
      <div class="card">
        <Toolbar class="mb-4">
          <template #start>
            <Button
              label="เพิ่ม"
              icon="pi pi-plus"
              severity="success"
              class="mr-4"
              @click="payDialog = true"
            />
            <Button
              label="ลบ"
              icon="pi pi-trash"
              severity="danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedPays || !selectedPays.length"
            />
            <Button
              icon="pi pi-refresh"
              @click="refreshData"
            />
            <small class="opacity-60">{{ lastRefreshed }}</small>
          </template>
          <template #end>
            <FileUpload
              mode="basic"
              accept="image/*"
              :maxFileSize="1000000"
              label="เพิ่มข้อมูลจากไฟล์"
              chooseLabel="เพิ่มข้อมูลจากไฟล์"
              class="mr-4 inline-block"
              disabled
            />
            <Button
              label="ดาวน์โหลดไฟล์ excel"
              icon="pi pi-upload"
              class="mr-4"
              severity="help"
              @click="exportCSV($event)"
            />
          </template>
        </Toolbar>
  
        <DataTable
          ref="dt"
          :value="pays"
          v-model:selection="selectedPays"
          dataKey="_id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="แสดง {first} ถึง {last} จากทั้งหมด {totalRecords}"
        >
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <p class="m-0">รายการ <span class="mx-5 font-bold text-green-700">{{ pays?.length }}</span></p>
              <span class="p-input-icon-right border rounded">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" class="px-3" placeholder="ค้นหารายการ..." />
              </span>
            </div>
          </template>
  
          <template #empty>
            <div class="w-full flex justify-center items-center py-48 border-t border-b">
              <p class="tex-lg">ไม่มีข้อมูล</p>
            </div>
          </template>
  
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>

          <Column field="code" header="เลขที่ใบเสร็จ" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div>
                <p>{{ slotProps.data.code }}</p>
              </div>
            </template>
          </Column>
          <Column field="supplier_detail.supplier_company_name" header="ร้านค้า" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div>
                <p>{{ slotProps.data.supplier_detail.supplier_company_name }}</p>
                <small>{{ slotProps.data.supplier_detail.supplier_company_number !== 'ไม่มี' ? slotProps.data.supplier_detail.supplier_company_number : null }}</small>
              </div>
            </template>
          </Column>
          <Column field="date" header="วันที่" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div>
                <p>{{ slotProps.data.date }}</p>
              </div>
            </template>
          </Column>
          <Column field="total" header="ราคา" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div>
                <p>{{ slotProps.data.net }}</p>
              </div>
            </template>
          </Column>
          <Column field="bill_img" header="ไฟล์แนบ" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div v-if="slotProps.data.bill_img">
                <Image :src="`https://drive.google.com/thumbnail?id=${slotprops.data.bill_img}`" alt="..." width="150" preview />
              </div>
              <div v-else>
                <p>ยังไม่ได้แนบไฟล์</p>
              </div>
            </template>
          </Column>
          
          <Column :exportable="false" style="min-width: 10rem" class="border-b">
            <template #body="slotProps">
              <Button
                icon="pi pi-eye"
                outlined
                lable="open"
                class="py-1.5 text-blue-500"
                @click="seePay(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="text-yellow-500"
                @click="openEditProduct(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                class="text-red-500"
                @click="confirmDeletePay(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
  
      <Dialog
        v-model:visible="payDialog"
        :style="{ width: '450px' }"
        :header="formCurPage === 1 ? 'เพิ่มร้านค้า' : formCurPage === 2 ? 'เพิ่มรายละเอียดค่าใช้จ่าย' : 'ตรวจสอบและบันทึก'"
        :modal="true"
        class="p-fluid"
      >
        <div class="mb-5 w-full flex justify-center items-center sticky top-0 bg-white pb-5">
          <div class="w-10 h-10 rounded-full bg-sky-400 grid place-items-center">
            <p class="font-bold text-xl">1</p>
          </div>
          <div class="h-2 w-24 bg-sky-200" :class="formCurPage > 1 ? 'bg-sky-400 ' : ''">
          </div>
          <div class="w-10 h-10 rounded-full bg-sky-200 grid place-items-center" :class="formCurPage > 1 ? 'bg-sky-400' : ''">
            <p class="font-bold text-xl">2</p>
          </div>
          <div class="h-2 w-24 bg-sky-200" :class="formCurPage === 3 ? 'bg-sky-400' : ''">
          </div>
          <div class="w-10 h-10 rounded-full bg-sky-200 grid place-items-center" :class="formCurPage === 3 ? 'bg-sky-400' : ''">
            <p class="font-bold text-xl">3</p>
          </div>
        </div>
        <!--1-->
        <div v-if="formCurPage===1" class="card flex flex-col gap-y-4">
          <SelectButton v-model="formType" :options="['เลือกร้านค้า', 'เพิ่มใหม่']" aria-labelledby="basic" />
          <div v-if="formType === 'เลือกร้านค้า'" class="flex flex-col gap-y-4">
            <div class="field">
              <div class="flex w-full items-center gap-2 mb-5">
                <Dropdown v-model="supplier" @change="selectedRefSup" :options="suppliers" filter optionLabel="supplier_company_name" placeholder="เลือกร้านค้า" class="bg-sky-100 w-full">
                  <template #value="slotProps">
                      <div v-if="slotProps.value.supplier_company_name && slotProps.value.supplier_company_name !== ''" class="flex items-center">
                          <div>{{ slotProps.value.supplier_company_name }}</div>
                      </div>
                      <span v-else>
                          {{ slotProps.placeholder }}
                      </span>
                  </template>
                  <template #option="slotProps">
                      <div class="flex items-center">
                          <div>{{ slotProps.option.supplier_company_name }}</div>
                      </div>
                  </template>
                </Dropdown>
              </div>
              <div class="relative">
                <p class="p-error absolute text-2xl -top-3" v-if="!pay.supplier_detail.supplier_company_name">
                  *
                </p>
                <InputText
                class="py-2 px-5 ring-1"
                id="supplier_company_name"
                v-model="pay.supplier_detail.supplier_company_name"
                required="true"
                autofocus
                placeholder="ชื่อร้านค้า (สาขา)"
              />
              </div>
            </div>
            <div class="field">
              <label>เลขประจำตัวผู้เสียภาษี หรือ รหัสประชาชน</label>
              <InputText
                maxlength="13"
                class="py-2 px-5 ring-1"
                id="supplier_company_number"
                v-model.trim="pay.supplier_detail.supplier_company_number"
                required="true"
                placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
                autofocus
              />
            </div>
            <div class="field">
              <label>
                เบอร์ติดต่อร้านค้า
              </label>
              <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="pay.supplier_detail.supplier_tel" required="false" />
            </div>
            <div class="field">
              <label for="supplier_company_address">ที่อยู่ร้านค้า</label>
              <InputText
                class="p-2 ring-1"
                id="supplier_company_address"
                v-model.trim="pay.supplier_detail.supplier_company_address"
                required="false"
                placeholder="ที่อยู่ร้านค้า"
                autofocus
              />
            </div>
            <div class="field">
              <div>
                <label for="supplier_type" class="mb-3">แผนที่</label>
                <InputText
                  class="p-2 ring-1"
                  id="supplier_type"
                  v-model.trim="pay.supplier_detail.supplier_type"
                  required="false"
                  placeholder="ลิงค์แผนที่ร้านค้า"
                  autofocus
                />
              </div>
            </div>
          </div>
          <!----------------------------------------->
          <div v-else class="flex flex-col gap-y-4">
            <div class="relative">
              <p class="p-error absolute text-2xl -top-3" v-if="!pay.supplier_detail.supplier_company_name">
                *
              </p>
              <InputText
              class="py-2 px-5 ring-1"
              id="supplier_company_name"
              v-model="pay.supplier_detail.supplier_company_name"
              required="true"
              autofocus
              placeholder="ชื่อร้านค้า (สาขา)"
            />
            </div>
            <div class="field">
              <label>เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน</label>
              <InputText
                maxlength="13"
                class="p-2 ring-1"
                id="supplier_company_number"
                v-model.trim="pay.supplier_detail.supplier_company_number"
                required="true"
                placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
                autofocus
              />
            </div>
            <div class="field">
              <label>
                เบอร์ติดต่อร้านค้า
              </label>
              <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="pay.supplier_detail.supplier_tel" required="false" />
            </div>
            <div class="field">
              <label for="supplier_company_address">ที่อยู่ร้านค้า</label>
              <InputText
                class="p-2 ring-1"
                id="supplier_company_address"
                v-model.trim="pay.supplier_detail.supplier_company_address"
                required="false"
                placeholder="ที่อยู่ร้านค้า"
                autofocus
              />
            </div>
            <div class="field">
              <div>
                <label for="supplier_type" class="mb-3">แผนที่</label>
                <InputText
                  class="p-2 ring-1"
                  id="supplier_type"
                  v-model.trim="pay.supplier_detail.supplier_type"
                  required="false"
                  placeholder="ลิงค์แผนที่ร้านค้า"
                  autofocus
                />
              </div>
            </div>
          </div>
        </div>
        <!--2-->
        <div v-if="formCurPage===2" class="card flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-4">
            <div class="field">
              <label>เลขที่ใบเสร็จ</label>
              <InputText
                class="py-2 px-5 ring-1"
                id="code"
                v-model.trim="pay.code"
                required="true"
                placeholder="เลขที่ใบเสร็จ"
                autofocus
              />
            </div>
            <div class="field">
              <label>
                วันที่
              </label>
              <Calendar v-model="pay.date" dateFormat="dd/mm/yy" showButtonBar inputClass="ring-1 rounded py-2 px-5" />
            </div>
            <div class="field flex flex-col items-center">
              <Button label="เพิ่มรายการ" icon="pi pi-plus" iconPos="right" class="w-fit px-3 py-2 bg-sky-400 text-white mb-3" @click="addProduct" />
              <div class="flex flex-col gap-2">
                <div v-for="(prod, prodIndex) in pay.product_detail" :key="prodIndex" class="bg-sky-100 p-2">
                  <div class="w-full flex justify-end items-center pb-2">
                    <i class="pi pi-times hover:text-red-500 cursor-pointer hover:rotate-180 ease-in-out duration-300" @click="pay.product_detail.splice(prodIndex, 1)"></i>
                  </div>
                  <div class="field">
                    <InputText v-model="prod.product_name" placeholder="ชื่อสินค้า" class="ring-1 px-5 py-2" />
                  </div>
                  <div class="field">
                    <textarea v-model="prod.product_text" placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" class="ring-1 px-5 w-full rounded py-2" />
                  </div>
                  <div class="flex flex-col gap-3 py-3">
                    <div class="field flex items-center gap-2 text-center">
                      <p>ราคา/หน่วย</p>
                      <InputNumber inputClass="py-2 px-5 ring-1 text-end" class="w-2/5" v-model="prod.product_price" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="2" />
                      <p>บาท</p>
                    </div>
                    <div class="field flex items-center gap-2 text-center">
                      <p>จำนวน</p>
                      <InputNumber v-model="prod.product_amount" inputId="minmax-buttons" inputClass="py-2 ring-1 pr-5 text-center" class="w-24" mode="decimal" showButtons :min="1" />
                      <InputText v-model="prod.unit" class="ring-1 py-2 px-5 w-1/4" placeholder="หน่วย" />
                    </div>
                    <p>ราคาสุทธิ
                      <span class="px-5 font-bold underline hidden">
                        {{ prod.product_total = prod.product_amount*prod.product_price }}
                      </span>
                      <span class="px-5 font-bold underline">
                        {{ formatCurrency(prod.product_total) }}
                      </span>
                      บาท
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="field">
              <div>
                <label for="supplier_type" class="mb-3">ยอดรวมสินค้า</label>
                <span class="px-5 font-bold hidden">{{ pay.total = calTotalPrice(pay.product_detail) }}</span>
                <span class="px-5 font-bold">{{ formatCurrency(pay.total) }}</span>
                บาท
              </div>
            </div>
            <div class="field flex items-center gap-2 text-center">
                <p>ส่วนลด</p>
                <InputNumber inputClass="py-2 px-5 ring-1 text-end" class="w-2/5" v-model="pay.discount" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="2" />
                <p>บาท</p>
            </div>
            <div class="field">
              <div>
                <label for="supplier_type" class="mb-3">ยอดชำระสุทธิ</label>
                <span class="px-5 font-bold hidden">{{ pay.net = calTotalPrice(pay.product_detail) - pay.discount }}</span>
                <span class="px-5 font-bold">{{ formatCurrency(pay.net) }}</span>
                บาท
              </div>
            </div>
          </div>
        </div>
        <!--3-->
        <div v-if="formCurPage===3" class="card flex flex-col gap-y-4">
          <div class="flex flex-col gap-y-4">
            <div class="field">
              <div class="flex w-full items-center gap-2 mb-5">
                <Dropdown v-model="supplier" @change="selectedRefSup" :options="suppliers" filter optionLabel="supplier_company_name" placeholder="เลือกร้านค้า" class="bg-sky-100 w-full">
                  <template #value="slotProps">
                      <div v-if="slotProps.value.supplier_company_name && slotProps.value.supplier_company_name !== ''" class="flex items-center">
                          <div>{{ slotProps.value.supplier_company_name }}</div>
                      </div>
                      <span v-else>
                          {{ slotProps.placeholder }}
                      </span>
                  </template>
                  <template #option="slotProps">
                      <div class="flex items-center">
                          <div>{{ slotProps.option.supplier_company_name }}</div>
                      </div>
                  </template>
                </Dropdown>
              </div>
              <div class="relative">
                <p class="p-error absolute text-2xl -top-3" v-if="!pay.supplier_detail.supplier_company_name">
                  *
                </p>
                <InputText
                class="py-2 px-5 ring-1"
                id="supplier_company_name"
                v-model="pay.supplier_detail.supplier_company_name"
                required="true"
                autofocus
                placeholder="ชื่อร้านค้า (สาขา)"
              />
              </div>
            </div>
            <div class="field">
              <label>เลขประจำตัวผู้เสียภาษี หรือ รหัสประชาชน</label>
              <InputText
                maxlength="13"
                class="py-2 px-5 ring-1"
                id="supplier_company_number"
                v-model.trim="pay.supplier_detail.supplier_company_number"
                required="true"
                placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
                autofocus
              />
            </div>
            <div class="field">
              <label>
                เบอร์ติดต่อร้านค้า
              </label>
              <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="pay.supplier_detail.supplier_tel" required="false" />
            </div>
            <div class="field">
              <label for="supplier_company_address">ที่อยู่ร้านค้า</label>
              <InputText
                class="p-2 ring-1"
                id="supplier_company_address"
                v-model.trim="pay.supplier_detail.supplier_company_address"
                required="false"
                placeholder="ที่อยู่ร้านค้า"
                autofocus
              />
            </div>
            <div class="field">
              <div>
                <label for="supplier_type" class="mb-3">แผนที่</label>
                <InputText
                  class="p-2 ring-1"
                  id="supplier_type"
                  v-model.trim="pay.supplier_detail.supplier_type"
                  required="false"
                  placeholder="ลิงค์แผนที่ร้านค้า"
                  autofocus
                />
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <div v-if="formCurPage===1" class="flex justify-end gap-5 w-full mt-5">
            <Button
              label="ถัดไป"
              icon="pi pi-arrow-right"
              iconPos="right"
              :loading="loading"
              text
              class="rounded p-3"
              @click="formCurPage++"
            />
          </div>
          <div v-else-if="formCurPage===3" class="flex justify-between gap-5 w-full mt-5">
            <Button
              label="ย้อนกลับ"
              :loading="loading"
              text
              class="ml-5"
              @click="formCurPage--"
            />
            <Button
              label="บันทึก"
              iconPos="right"
              :loading="loading"
              text
              class="rounded p-3 text-white w-1/2 bg-green-500"
              @click="createNewPay"
            />
          </div>
          <div v-else class="flex gap-5 justify-between w-full mt-5">
            <Button
              label="ย้อนกลับ"
              :loading="loading"
              text
              class=""
              @click="formCurPage--"
            />
            <Button
              label="ถัดไป"
              icon="pi pi-arrow-right"
              iconPos="right"
              :loading="loading"
              text
              class="rounded p-3"
              @click="formCurPage++"
            />
          </div>
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="payEditDialog"
        :style="{ width: '450px' }"
        header="แก้ไขข้อมูลซัพพลายเออร์"
        :modal="true"
        class="p-fluid"
      >
        <div class="card flex flex-col gap-y-4">
          <div class="field">
            <label>
              ชื่อร้านค้า 
              <small class="p-error" v-if="!pay.supplier_detail.supplier_company_name">
                *กรุณาเพิ่มชื่อร้านค้า
              </small>
            </label>
            <InputText
              class="p-2 ring-1"
              id="supplier_company_name"
              v-model="pay.supplier_detail.supplier_company_name"
              required="true"
              autofocus
              placeholder="ชื่อร้านค้า (สาขา)"
            />
          </div>
          <div class="field">
            <label for="supplier_company_number">เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน</label>
            <InputText
              maxlength="13"
              class="p-2 ring-1"
              id="supplier_company_number"
              v-model.trim="pay.supplier_detail.supplier_company_number"
              required="true"
              placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
              autofocus
            />
            <small class="p-error" v-if="!pay.supplier_detail.supplier_company_number"
              >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
            >
          </div>
          <div class="field">
            <label>
              เบอร์ติดต่อร้านค้า
            </label>
            <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="pay.supplier_detail.supplier_tel" required="false" />
          </div>
          <div class="field">
            <label for="supplier_company_address">ที่อยู่ร้านค้า</label>
            <InputText
              class="p-2 ring-1"
              id="supplier_company_address"
              v-model.trim="supplier.supplier_company_address"
              required="false"
              placeholder="ที่อยู่ร้านค้า"
              autofocus
            />
          </div>
          
          <div class="field">
            <div>
              <label for="supplier_type" class="mb-3">แผนที่</label>
              <InputText
                class="p-2 ring-1"
                id="supplier_type"
                v-model.trim="supplier.supplier_type"
                required="false"
                placeholder="ลิงค์แผนที่ร้านค้า"
                autofocus
              />
            </div>
          </div>
        </div>
        <br />
  
        <template #footer>
          <Button label="ยกเลิก" icon="pi pi-times" text @click="hideDialog" />
          <Button
            label="บันทึก"
            icon="pi pi-check"
            :loading="loading"
            text
            class="text-green-700 font-bold hover:bg-green-100 px-0 hover:px-3 duration-300 ease-in-out transition-transform rounded"
            @click="editingSupplier"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deletePayDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="pay.supplier_detail.supplier_company_name"
            >คุณแน่ใจว่าต้องการลบร้านค้ารายนี้หรือไม่ ?<b>{{ pay.supplier_detail.supplier_company_name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            class="py-3"
            label="ยกเลิก"
            icon="pi pi-times"
            text
            @click="deletePayDialog = false"
          />
          <Button
            class="py-3"
            label="ยืนยัน"
            icon="pi pi-check"
            text
            @click="deletePay"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deletePaysDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="pay">คุณแน่ใจว่าต้องการลบร้านค้ารายนี้หรือไม่ ?</span>
        </div>
        <template #footer>
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            text
            @click="deletePaysDialog = false"
          />
          <Button label="ยืนยัน" icon="pi pi-check" text @click="deleteSelectedPays" />
        </template>
      </Dialog>

      <Dialog v-model:visible="openPay" modal :header="selectedPay?.supplier_company_name" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-col gap-y-2">
          <span><strong>ชื่อร้านค้า : </strong>{{ selectedPay?.supplier_company_name }} 
          </span>
          <span><strong>เลขประจำตัวผู้เสียภาษี : </strong>{{ selectedPay?.supplier_detail.supplier_company_number || '-' }}</span>
          <span><strong>ที่อยู่ : </strong>{{ selectedPay?.supplier_detail.supplier_company_address }}</span>
          <a :href="selectedPay?.supplier_detail.supplier_type" target="_blank" class="cursor-pointer hover:text-bold hover:text-orange-400 duration-300 ease-in-out"><i class="pi pi-map-marker pr-3 text-red-500"></i>{{ selectedSupplier?.supplier_type }}</a>
          <span><strong>เบอร์โทร : </strong>{{ selectedPay?.supplier_detail.supplier_tel }}</span>
          <div>
            <p class="font-bold">ประวัติการสั่งซื้อ</p>
            <div class="grid grid-cols-12">
              <div class="col-span-full border grid grid-cols-12">
                <div class="border-r col-span-2">
                  <p class="text-center">เลขที่บิล</p>
                </div>
                <div class="border-r col-span-4">
                  <p class="text-center">รายการ</p>
                </div>
                <div class="border-r col-span-2">
                  <p class="text-center">ราคา</p>
                </div>
                <div class="border-r col-span-2">
                  <p class="text-center">วันที่ซื้อ</p>
                </div>
                <div class="col-span-2">
                  <p class="text-center">ไฟล์แนบ</p>
                </div>
              </div>
              <div class="col-span-full grid grid-cols-12 border-b border-l border-r min-h-10">
                <div v-if="selectedPay.supplier_detail.remark.length < 1" class="col-span-full flex items-center justify-center">
                  <p class="text-center">ไม่มีรายการ</p>
                </div>
                <div class="col-span-full border grid grid-cols-12" v-else v-for="(his, hisIndex) in selectedPay.supplier_detail.remark" :key="hisIndex">
                  <div class="border-r col-span-2 h-10">
                    <p class="text-center">-</p>
                  </div>
                  <div class="border-r col-span-4 h-10">
                    <p class="text-center">-</p>
                  </div>
                  <div class="border-r col-span-2 h-10">
                    <p class="text-center">-</p>
                  </div>
                  <div class="border-r col-span-2 h-10">
                    <p class="text-center">-</p>
                  </div>
                  <div class="col-span-2 h-10">
                    <p class="text-center">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { FilterMatchMode } from "primevue/api";
  import { useToast } from "primevue/usetoast";
  import { Suppliers } from "@/service/Supplier";
  import axios from 'axios';
  
  onMounted(async () => {
    refreshData()
    fetchSuppliers()
  })
  
  const suppliers = ref([])
  const openPay = ref(false);
  const loading = ref(false);
  const payEditDialog = ref(false);
  const lastRefreshed = ref()
  const toast = useToast();
  const dt = ref();
  const pays = ref([]);
  const selectedPay = ref();
  const deletePayDialog = ref(false);
  const deletePaysDialog = ref(false);
  const selectedPays = ref([]);
  const uploadfiles = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  
  // see detail
  const seePay = (data) => {
    openPay.value = true
    selectedPay.value = data
    console.log("data", selectedPay.value)
  }

  // suppliers
  const fetchSuppliers = async () => {
    const response = await Suppliers.getSuppliers()
    if( response.status ) {
      suppliers.value = response.data
    } else {
      console.log(response)
    }
  }
  const supplier = ref({})
  const selectedRefSup = () => {
    pay.value.supplier_detail = {...supplier.value}
  }
  const formType = ref('เลือกร้านค้า')

  // delete
  const confirmDeletePay = (prod) => {
    pay.value = prod
    deletePayDialog.value = true;
  }
  const deletePay = async () => {
    loading.value = true
    const pay_to_delete = pay.value
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/getPOSBy/${pay_to_delete._id}`,
        {
          headers: {
            'auth-token' : import.meta.env.VITE_TOKEN
          }
        }
      )
      if(response.data.status) {
        console.log(response.data)
        toast.add({
          severity: "success",
          summary: "สำเร็จ!",
          detail: "ลบรายการแล้ว",
          life: 3000,
        })
        refreshData()
        deletePayDialog.value = false;
        resetData()
      }
    }
    catch (err) {
      console.log(err)
      toast.add({
        severity: "error",
        summary: "เกิดข้อผิดพลาด!",
        detail: "ไม่สามารถลบรายการได้",
        life: 3000,
      });
    }
    finally {
      loading.value = false
    }
  }
  const confirmDeleteSelected = () => {
    deletePaysDialog.value = true;
  }
  
  const deleteSelectedPays = async () => {
    const pays_to_delete = pays.value.filter(
      (val) => !selectedPays.value.includes(val)
    )
    if (pays_to_delete.length > 0 ) {
      for (let ct of selectedPays.value) {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/getPOSBy/${sp._id}`,
          {
            headers: {
              'auth-token' : import.meta.env.VITE_TOKEN
            }
          }
        )
        if(response.data.status) {
          console.log(response.data)
        }
      }
    }
    refreshData()
  }
  
  // create && edit
  const hideDialog = () => {
    payDialog.value = false
    editProductDialog.value = false
    addProductDialog.value = false
  }

  const pay = ref(
    {
      _id: null,
      code : null,
      supplier_detail : {
          supplier_tel: null,
          supplier_company_name: null,
          supplier_company_number: null,
          supplier_company_address: null,
          supplier_type: null,
          supplier_id : null
      },
      product_detail: [],
      bill_img: null,
      discount: null,
      date : null,
      note: null,
      total : 0,
      net : 0,
      total_vat : 0
    }
  )
  const payDialog = ref(false)

  const createNewPay = async () => {
    loading.value = true;
    const data = {
      code: pay.value.code,
      supplier_detail: {
        supplier_tel: pay.value.supplier_detail.supplier_tel,
        supplier_company_name: pay.value.supplier_detail.supplier_company_name,
        supplier_company_number: pay.value.supplier_detail.supplier_company_number,
        supplier_company_address: pay.value.supplier_detail.supplier_company_address,
        supplier_type : pay.value.supplier_detail.supplier_type,
        supplier_id : pay.value.supplier_detail.supplier_id
      },
      product_detail: [...pay.value.product_detail],
      bill_img: pay.value.bill_img,
      discount: pay.value.discount,
      date: pay.value.date,
      note: pay.value.note,
      total: pay.value.total,
      net: pay.value.net,
      total_vat: pay.value.total_vat
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/Create`,
        data,
        {
          headers: {
            'auth-token' : import.meta.env.VITE_TOKEN,
            'Content-type' : 'application/json'
          }
        }
      )
      if (response.data.status) {
        toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "เพิ่มรายการใหม่แล้ว",
            life: 3000,
        });
        payDialog.value = false;
        refreshData()
      }
    }
    catch (err) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "เพิ่มรายการใหม่ล้มเหลว",
            life: 3000,
        });
    }
    finally {
        loading.value = false
        refreshData()
    }
  }
  const editingPay = async () => {
    loading.value = true;
    const id =  pay.value._id
    const data = {
      code: pay.value.code,
      supplier_detail : {
        supplier_tel: pay.value.supplier.supplier_tel,
        supplier_company_name: pay.value.supplier.supplier_company_name,
        supplier_company_number: pay.value.supplier.supplier_company_number,
        supplier_company_address: pay.value.supplier.supplier_company_address,
        supplier_type : pay.value.supplier.supplier_type,
        supplier_id : pay.value.supplier.supplier_id
      },
      product_detail: [...pay.value.product_detail],
      bill_img: pay.value.bill_img,
      discount: pay.value.discount,
      date: pay.value.date,
      note: pay.value.note,
      total: pay.value.total,
      net: pay.value.net,
      total_vat: pay.value.total_vat
    }
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/Create/${id}`,
        data,
        {
          headers: {
            'auth-token' : import.meta.env.VITE_TOKEN,
            'Content-type' : 'application/json'
          }
        }
      )
      if (response.data.status) {
        toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "แก้ไขรายการแล้ว",
            life: 3000,
        });
        payDialog.value = false;
        resetData()
        refreshData()
      }
    }
    catch (err) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "แก้ไขรายการล้มเหลว",
            life: 3000,
        });
    }
    finally {
        loading.value = false
        refreshData()
    }
  }

  // product
  const product = ref({
    product_name: null,
    product_text: null,
    product_price: null,
    product_amount: 1,
    product_total: 0,
    product_cost_type: null,
    unit : null,
    isVat : false,
    vat : 0,
    sumVat : null
  })
  const addProduct = () => {
    pay.value.product_detail.push({...product.value})
    product.value = {
      product_name: null,
      product_text: null,
      product_price: 0,
      product_amount: 1,
      product_total: 0,
      product_cost_type: null,
      unit : null,
      isVat : false,
      vat : 0,
      sumVat : null
    }
  }
  const editProductDialog = ref(false)
  const openEditProduct = (product) => {
    product.value = {
      product_name: product.product_name || null,
      product_text: product.product_text || null,
      product_price: product.product_price || 0,
      product_amount: product.product_amount || 1,
      product_total: product.product_total || 0,
      product_cost_type: product.product_cost_type || null,
      unit : product.unit || null,
      isVat : product.isVat || false,
      vat : product.vat || 0,
      sumVat : product.sumVat || null
    }
    editProductDialog.value = true
  }
  const editProduct = () => {
    pay.value.product_detail[index] = product.value
    product.value = {
      product_name: null,
      product_text: null,
      product_price: 0,
      product_amount: 1,
      product_total: 0,
      product_cost_type: null,
      unit : null,
      isVat : false,
      vat : 0,
      sumVat : null
    }
    editProductDialog.value = false
  }
  const addProductDialog = ref(false)
  const openAddProduct = () => {
    product.value = {
      product_name: null,
      product_text: null,
      product_price: 0,
      product_amount: 1,
      product_total: 0,
      product_cost_type: null,
      unit : null,
      isVat : false,
      vat : 0,
      sumVat : null
    }
    addProductDialog.value = true
  }
  
  // etc
  const refreshData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/getPosAll`,
        {
          headers: {
            'auth-token' : import.meta.env.VITE_TOKEN
          }
        }
      )
      if ( response.data.status ) {
        pays.value = response.data.data
        const currentTimestamp = Date.now();
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(currentTimestamp));
        lastRefreshed.value = formattedTime
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  const resetData = () => {
    pay.value = {
      _id: null,
      code : null,
      supplier_detail : {
          supplier_tel: null,
          supplier_company_name: null,
          supplier_company_number: null,
          supplier_company_address: null,
          supplier_type: null,
          supplier_id : null
      },
      product_detail: [],
      bill_img: null,
      discount: 0,
      date : null,
      note: null,
      total : 0,
      net : 0,
      total_vat : 0
    }
  }
  const exportCSV = () => {
    dt.value.exportCSV();
  }

  const formCurPage = ref(1)
  const formatCurrency = (value) => {
  if (value !== undefined && value !== null) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return;
}

const calTotalPrice = (products) => {
  const prices = products.map(prod=>{
    return prod.product_amount*prod.product_price
  })
  const result = prices.length > 0 ? prices.reduce(( a,b ) => a + b, 0 ) : 0
  return result
}
</script>
  