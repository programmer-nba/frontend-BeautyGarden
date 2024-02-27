<template>
  <div class="h-full">
    <Toast />
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openQuotation"
    >
      <DocQuotation
        :color="color"
        :data="selectedQuotation"
        @close="closeHandle"
      />
    </div>
    <div v-if="!openQuotation" class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="เพิ่ม"
            icon="pi pi-plus"
            severity="success"
            class="mr-4"
            @click="openNew"
          />
          <Button
            label="ลบ"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedQuotations || !selectedQuotations.length"
          />
          <Button icon="pi pi-refresh" @click="refresh" />
          <small class="opacity-60">{{ lastRefreshed }}</small>
        </template>
        <template #end>
          
          <Button
            label="ดาวน์โหลดไฟล์ excel"
            icon="pi pi-upload"
            class="mr-4"
            severity="help"
            @click="exportCSV($event)"
          />
          <ColorPicker class="px-3" v-model="color" />
          {{ color }}
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        :value="quotations"
        v-model:selection="selectedQuotations"
        dataKey="_id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="แสดง {first} ถึง {last} จากเอกสารทั้งหมด {totalRecords} ชุด"
        :pt="{
          header: { style: `backgroundColor: #${color}` },
        }"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">จัดการเอกสาร</h4>
            <span class="p-input-icon-right border rounded">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="" />
            </span>
          </div>
        </template>

        <template #empty>
          <div class="w-full flex justify-center items-center py-48 border-t border-b">
            <p class="tex-lg">ไม่มีข้อมูล</p>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column
          field="quotation"
          header="เลขที่"
          sortable
          style="min-width: 15rem"
          class="border-b"
        >
        <template #body="slotProps">
          <span class="text-xs">
            {{ slotProps.data?.quotation }}
            <i 
              size="small"
              @click="onCoppy(slotProps.data?.quotation)" 
              class="pi pi-copy cursor-pointer hover:text-yellow-500 hover:bg-yellow-100 duration-300 ease-in-out p-2 rounded-full" 
              v-tooltip.top="'คัดลอก'"
              >
            </i>
          </span>
        </template>
        </Column>
        <Column
          field="customer_detail.customer_name"
          header="ชื่อลูกค้า"
          sortable
          style="min-width: 16rem"
          class="border-b"
        >
          <template #body="slotProps">
            <div class="flex flex-col">
              <p>{{ slotProps.data.customer_detail.customer_name }} </p>
              <p class="text-sm">{{ 
                slotProps.data.customer_detail.customer_lastname&&slotProps.data.customer_detail.customer_lastname!=='undefined' 
                ? `(${slotProps.data.customer_detail.customer_lastname})` 
                : null }}
              </p>
            </div>
          </template>
        </Column>
        <Column
          field="start_date"
          header="วันที่เริ่ม"
          class="border-b"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ formatDateRef(slotProps.data.start_date) }}
          </template>
        </Column>
        <Column
          field="end_date"
          header="วันที่สิ้นสุด"
          class="border-b"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ formatDateRef(slotProps.data.end_date) }}
          </template>
        </Column>

        <Column
          field="vat.totalVat_deducted"
          class="border-b"
          header="ราคา"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            {{ 
              slotProps.data.sumVat
              ? formatCurrency(totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) - withHolding(slotProps.data)) 
              : formatCurrency(totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) - withHolding(slotProps.data)) 
            }}
          </template>
        </Column>
        <Column
          field="total_products"
          header="VAT 7%"
          sortable
          style="min-width: 8rem"
          class="border-b"
        >
          <template #body="slotProps">
            <div class="grid place-items-center w-full">
              <span class="text-sm text-center" 
              :class="slotProps.data.customer_branch.isVat 
              ? 'bg-yellow-200 rounded p-1' : ''">
                {{ 
                  slotProps.data.customer_branch.isVat && slotProps.data.sumVat ? "VAT นอก" 
                  : slotProps.data.customer_branch.isVat && !slotProps.data.sumVat ? "VAT ใน"
                  : "-" 
              }}
              </span>
            </div>
          </template>
        </Column>
        <Column
          field="vat.percen_deducted"
          header="หัก ณ ที่จ่าย"
          class="border-b"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <div class="grid place-items-center w-full">
              <span class="text-sm text-center" :class="slotProps.data.vat?.percen_deducted ? 'text-orange-500' : ''">
                {{ slotProps.data.vat?.percen_deducted ? "หัก ณ ที่จ่าย" : "-" }}
              </span>
            </div>
          </template>
        </Column>
        <Column
          field="status[0]"
          header="สถานะ"
          sortable
          style="min-width: 6rem"
          class="border-b"
        >
        </Column>
        <Column :exportable="false" style="min-width: 10rem" class="border-b">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-1 justify-center items-center">
              <Button 
                class="text-blue-600 hover:bg-blue-100" 
                icon="pi pi-file" 
                outlined 
                rounded
                @click="seeQuotation(slotProps.data)" />
              <Button
                class="text-yellow-600 hover:bg-orange-100"
                icon="pi pi-pencil"
                outlined
                rounded
                @click="editQuotation(slotProps.data)"
              />
              <Button
                class="text-red-600 hover:bg-red-100"
                icon="pi pi-trash"
                outlined
                rounded
                @click="confirmDeleteQuotation(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
    <!--create-->
    <Dialog
      v-model:visible="quotationDialog"
      :style="{ width: '500px' }"
      header="เพิ่มใบเสนอราคา"
      :modal="true"
      class="p-fluid"
    >
      <div
        v-if="loading"
        class="card w-full h-full absolute top-1/2 lef-1/2 translate-x-1/2 translate-y-1/2"
      >
        <img src="@/assets/spinner.svg" alt="Spinner" />
      </div>
      <div class="card">
        <div class="card flex flex-col gap-y-2 justify-center items-center">
          <p>วันที่เริ่มต้น</p>
          <Calendar class="border" v-model="start_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card flex flex-col mt-2 mb-5 gap-y-2 justify-center items-center">
          <p>วันที่สิ้นสุด</p>
          <Calendar class="border" v-model="end_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div>
          <h1 class="text-lg font-semibold py-1">เลือกหัวเอกสาร</h1>
          <div class="card flex justify-content-center">
            <Dropdown
              @change="refCompany"
              v-model="selectedCompany"
              editable
              :options="cpStore.myCompanies"
              optionLabel="Branch_company_name"
              placeholder="เลือกหัวเอกสาร"
              class="w-full md:w-14rem p-2"
            />
          </div>
        </div>
        <br />
        <Fieldset>
          <template #legend>
            <div
              v-if="selectedCompany"
              class="flex w-full py-2 justify-center items-center pl-2 bg-emerald-600 rounded-lg text-white"
            >
              <Avatar
                v-if="selectedCompany?.Branch_iden_number!=='-'"
                class="w-[75px]"
                :image="`https://drive.google.com/thumbnail?id=${selectedCompany?.Branch_iden_number}`"
                shape="circle"
              />
              <span class="font-bold"
                >{{ selectedCompany?.Branch_company_name }}
                {{
                  selectedCompany?.Branch_iden ? `(${selectedCompany?.Branch_iden})` : ""
                }}
                <Chip
                  class="px-2 text-xs ml-3"
                  :class="selectedCompany?.isVat ? 'bg-yellow-300' : 'hidden'"
                  :label="selectedCompany?.isVat ? 'VAT' : null"
                />
              </span>
            </div>
          </template>
          <br />
          <div v-if="selectedCompany">
            <p class="m-0">
              {{ selectedCompany?.Branch_company_address }}
            </p>
            <p v-if="selectedCompany.isVat" class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            
            <div>
              <h1>เลือกบัญชีธนาคาร</h1>
              <div class="card flex justify-content-center">
                <Dropdown
                  v-model="bank"
                  :options="selectedCompany.bank"
                  optionLabel="name"
                  placeholder="เลือกบัญชีธนาคาร"
                  class="w-full md:w-14rem"
                >
                </Dropdown>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
      <br />
      <hr />
      <br />
      <div class="card">
        <div class="mb-5">
          <h1 class="text-lg font-semibold py-1">เลือกลูกค้า</h1>
          <div class="card flex justify-content-center">
            <Dropdown
              @change="refCustomer"
              v-model="selectedCustomer"
              editable
              :options="customers"
              optionLabel="customer_name"
              placeholder="เลือกลูกค้า"
              class="w-full md:w-14rem p-2"
            />
          </div>
          <br />
          <div
            v-if="customer"
            class="flex w-full py-2 justify-center items-center px-2 bg-gray-200 rounded-lg text-slate-700"
          >
            <span class="font-bold"
              >{{ customer.customer_name }}
              {{ customer.customer_lastname ? `(${customer.customer_lastname})` : "" }}
            </span>
          </div>
        </div>
        <div class="field">
          <label for="customer_name">ชื่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_name"
            v-model="customer.customer_name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_name }"
          />
          <small class="p-error" v-if="submitted && !customer.customer_name"
            >กรุณาเพิ่มชื่อลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_number">รหัสลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_number"
            v-model.trim="customer.customer_number"
            required="true"
            autofocus
            :class="{ 'p-invalid': !customer.customer_number }"
          />
          <small class="p-error" v-if="!customer.customer_number"
            >กรุณาเพิ่มรหัสลูกค้า</small
          >
        </div>
        <div v-if="selectedCompany?.isVat" class="field">
          <label for="customer_taxnumber">เลขประจำตัวผู้เสีภาษี</label>
          <InputText
            class="p-2"
            id="customer_taxnumber"
            v-model.trim="customer.customer_taxnumber"
            :class="{ 'p-invalid': !customer.customer_taxnumber }"
          />
          <small class="p-error" v-if="!customer.customer_taxnumber"
            >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_phone"
            v-model.trim="customer.customer_phone"
            :class="{ 'p-invalid': !customer.customer_phone }"
          />
          <small class="p-error" v-if="!customer.customer_phone"
            >กรุณาเพิ่มเบอร์ติดต่อลูกค้า</small
          >
        </div>
        <div v-if="selectedCompany?.isVat" class="field">
          <label for="customer_lastname">สำนักงานใหญ่/สาขา</label>
          <InputText
            class="p-2"
            id="customer_lastname"
            v-model.trim="customer.customer_lastname"
          />
        </div>
        <div class="field">
          <label for="customer_position">ที่อยู่ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_position"
            v-model.trim="customer.customer_position"
            :class="{ 'p-invalid': !customer.customer_position }"
          />
          <small class="p-error" v-if="!customer.customer_position"
            >กรุณาเพิ่มที่อยู่ลูกค้า</small>
        </div>
        <div class="field">
          <label for="customer_email">อีเมล์ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_email"
            v-model.trim="customer.customer_email"
          />
        </div>
        <div class="field">
          <div>
            <label for="inventoryStatus" class="mb-3">ประเภทลูกค้า</label>
            <Dropdown
              id="inventoryStatus"
              v-model.trim="customer.customer_type"
              :options="statuses"
              placeholder="เลือกประเภทลูกค้า"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <Tag
                    :value="slotProps.value.value"
                    :severity="getStatusLabel(slotProps.value.label)"
                  />
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <Tag
                    :value="slotProps.value"
                    :severity="getStatusLabel(slotProps.value)"
                  />
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
          </div>
          <div v-if="selectedCompany?.isVat" class="flex py-4 align-items-center">
            <Checkbox
              v-model="isWithholding"
              inputId="withholding"
              name="withholding"
              :binary="true"
              class="shadow"
            />
            <label for="withholding" class="ml-2"> หัก ณ ที่จ่าย </label>
          </div>
          <div v-if="isWithholding" class="card py-2 flex justify-content-center">
            <Dropdown
              v-model="withholdingPercent"
              :options="percents"
              placeholder="เลือกเปอร์เซ็น"
              class="w-full md:w-14rem"
            />
          </div>
        </div>
        <div class="field">
          <label for="customer_contact">ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact"
            v-model.trim="customer.customer_contact"
            :class="{ 'p-invalid': !customer.customer_contact }"
          />
        </div>
        <div class="field">
          <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            :class="{ 'p-invalid': !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />
      <span class="my-4" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? 'Vat ใน' : 'Vat นอก' }}</span>
      </span>
      <br />
      <div class="card">
        <DataView :value="products">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex justify-between flex-column sm:flex-row sm:items-center p-4 gap-3 border-b"
                  :class="{ 'surface-border': index !== 0 }"
                >
                  <div class="overflow-x-auto w-[120px]">
                    <div v-if="item.product_logo64?.length > 0" class="flex border overflow-x-auto">
                      <div v-for="(pic, index) in item.product_logo64" :key="index" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="pic"
                          :alt="index"
                        />
                      </div>
                    </div>
                    <div v-if="item.product_logo?.length>1" class="flex border overflow-x-auto">
                      <div v-for="(pic, index) in item.product_logo" :key="index" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="`https://drive.google.com/thumbnail?id=${pic}`"
                          :alt="index"
                        />
                      </div>
                    </div>
                  </div>
              
                  <div
                    class="flex flex-column md:flex-row justify-between md:items-center flex-1 gap-4"
                  >
                    <div>
                      <div>
                        <p class="text-clip font-semibold overflow-hidden w-[100px]">
                          {{ item.product_name }}
                        </p>
                        <div class="w-[100px] overflow-y-hidden">
                          <p
                            v-for="(proText, textIndex) in item.product_text"
                            class="text-clip overflow-hidden w-[100px]"
                            :key="textIndex"
                          >
                            {{ proText }}
                          </p>
                        </div>
                        <p
                          class="font-normal text-xs text-clip overflow-hidden w-[100px]"
                        >
                          {{ formatCurrency(item.product_price) }} x
                          {{ item.product_amount }} {{ item.unit }}
                          {{
                            item.vat_price>0 && sumVat ? ' (' + 'VATนอก' + ')' 
                            : item.vat_price>0 && !sumVat ? ' (' + 'VATใน' + ')' 
                            : null 
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency((item.product_amount * item.product_price)+item.vat_price)
                        }}.-</span
                      >
                      <div class="flex h-fit">
                        <Button
                          icon="pi pi-pencil"
                          outlined
                          rounded
                          class="hover:bg-yellow-200"
                          @click="editProduct(item)"
                        ></Button>
                        <Button
                          icon="pi pi-trash"
                          outlined
                          rounded
                          class="hover:bg-red-200"
                          @click="removeProduct(index)"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
      <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
        <Button
          icon="pi pi-plus-circle"
          class="px-2 py-2 w-fit text-lg font-bold text-white"
          label="เพิ่มสินค้า/บริการ"
          @click="
            ()=>{
              openProductForm = true
              product.product_logo64 = []
              product.isVat = false
              product.vat_price = 0
            }
          "
        />
      </div>
      <div
        v-if="openProductForm"
        class="flex flex-col gap-2 w-full py-6 justify-start items-center px-2 bg-gray-200 rounded-lg text-slate-700"
      >
        <div class="card flex justify-center">
          <div class="card">
            <FileUpload name="demo[]" auto @uploader="customBase64Uploader" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload>
                <template #content>
                  <div v-if="product?.product_logo64?.length>0" class="card flex flex-col justify-center">
                    <div class="flex gap-2 w-full pr-5 justify-between h-[100px] items-center" v-for="(pic, index) in product?.product_logo64" :key="index">
                      <Image :src="pic" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo64.splice(index, 1)" class="pi pi-times" style="color: red"></i>
                  </div>
                  </div>
                </template>
            </FileUpload>
          </div>
        </div>
        <div class="field">
          <label class="font-semibold text-lg">หัวข้อย่อย</label>
          <div class="card flex justify-content-center">
            <InputText class="px-2 py-2" v-model="product.product_name" />
          </div>
          <label class="font-semibold py-3 text-lg">รายละเอียด</label>
          <div
            v-for="(text, textInputIndex) in product.product_text"
            class="card flex flex-col gap-y-5 items-center justify-center"
          >
            <Textarea
              v-model="product.product_text[textInputIndex]"
              autoResize
              rows="5"
              cols="50"
              class="border-2 my-2"
            />
          </div>
          <div class="flex gap-2">
            <Button
            label="ลดบรรทัด"
            class="border-gray-400 text-gray-500 hover:bg-red-200 border-2 px-2 py-2"
            @click="product.product_text.pop()"
            :disabled="product.product_text.length < 2"
          />
          <Button
            label="เพิ่มบรรทัดใหม่"
            class="border-orange-300 text-orange-500 hover:bg-orange-200 border-2 px-2 py-2"
            @click="product.product_text.push('')"
          />
          </div>
          
        </div>
        <div class="field grid w-full px-5">
          <div class="field grid">
            <label for="price">ราคา/หน่วย</label>
            <InputNumber
              class="p-2 w-full"
              id="price"
              v-model="product.product_price"
              mode="currency"
              currency="THB"
            />
          </div>
          <div class="field grid">
            <label for="quantity">จำนวน</label>
            <InputNumber
              class="p-2"
              id="quantity"
              v-model="product.product_amount"
              integeronly
            />
          </div>
          <div class="field grid">
            <label for="unit">หน่วย</label>
            <InputText
              class="px-2"
              id="unit"
              v-model="product.unit"
            />
          </div>
          <div v-if="selectedCompany?.isVat" class="flex items-center my-3 gap-2">
            <p>VAT</p>
            <InputSwitch v-model="product.isVat" @change="changeProductVat" />
            <p>{{ product.isVat ? 'มี' : 'ไม่มี' }}</p>
          </div>
          <div class="field gap-3 flex border border-black pl-3 py-1 mt-3 rounded-lg">
            <label for="quantity" class="font-semibold">รวม</label>
            <p class="font-semibold px-2">
              {{ 
                sumVat
                ? formatCurrency((product.product_amount * product.product_price)+product.vat_price) 
                : formatCurrency((product.product_amount * product.product_price)-product.vat_price) 
              }} บาท
            </p>
          </div>
        </div>

        <div class="card flex gap-3 justify-center items-center py-2">
          <Button
            class="py-2 text-center pl-3 pr-5 rounded text-red-500"
            label="ยกเลิก "
            icon="pi pi-times"
            @click="cancleProduct"
          />
          <Button
            class="py-2 text-center px-3 rounded bg-emerald-600 text-white"
            :class="edittingProduct ? 'bg-orange-600' : ''"
            :label="edittingProduct ? 'แก้ไข' : 'เพิ่ม'"
            icon="pi pi-check"
            @click="addProduct"
          />
        </div>
      </div>

      <div class="flex flex-col gap-y-2 px-5 rounded-xl my-3 py-4 bg-slate-200 border-b">
        <p>ส่วนลด</p>
        <InputNumber
          v-model="discount"
          inputId="minmaxfraction"
          :minFractionDigits="2"
          :maxFractionDigits="5"
        />
      </div>

      <div class="flex flex-col gap-y-2">
        
        <span v-if="sumVat"
          >ราคาสินค้า
          <span class="border-b px-2">{{
            formatCurrency(sumProductsPrice) || 0
          }}</span></span
        >
        <span v-if="!sumVat"
          >ราคาสินค้า
          <span class="border-b px-2">{{
            formatCurrency(notSumVatsumProductsPrice) || 0
          }}</span></span
        >
        
        <span
          >ส่วนลด
          <span class="border-b px-2">{{ formatCurrency(discount) || 0 }}</span></span
        >
        <span
          >ราคาหลังหักส่วนลด
          <span class="border-b px-2">{{ formatCurrency(netPrices) || 0 }}</span></span
        >
        <span v-if="selectedCompany?.isVat"
          >VAT 7% <span class="border-b px-2">{{ formatCurrency(vat) || 0 }}</span></span
        >
        <span v-if="selectedCompany?.isVat"
          >ราคารวม VAT
          <span class="border-b px-2">{{ formatCurrency(netVat) || 0 }}</span></span
        >
        <span v-if="isWithholding"
          >หัก ณ ที่จ่าย {{ withholdingPercent }}%
          <span class="border-b px-2">{{
            formatCurrency(withholdingPrice) || 0
          }}</span></span
        >
        <span class="font-bold py-3"
          >ราคาสุทธิ
          <span class="border-b px-2">{{ formatCurrency(allEnd) || 0 }}</span></span
        >
      </div>
      
      <div class="card flex flex-col gap-y-2 py-5 justify-center items-center">
        <p>หมายเหตุ</p>
        <Textarea
          v-for="(mark, mIndex) in remark"
          v-model="remark[mIndex]"
          autoResize
          rows="5"
          cols="30"
        />
        <Button class="px-2 bg-yellow-200" label="เพิ่ม" @click="remark.push('')" />
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Save"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="createNewQuotation"
        />
      </template>
    </Dialog>
    <!--create-->

    <!--Edit-->
    <Dialog
      v-model:visible="quotationEditDialog"
      :style="{ width: '500px' }"
      header="แก้ไขใบเสนอราคา"
      :modal="true"
      class="p-fluid"
    >
      <div
        v-if="loading"
        class="card w-full h-full absolute top-1/2 lef-1/2 translate-x-1/2 translate-y-1/2"
      >
        <img src="@/assets/spinner.svg" alt="Spinner" />
      </div>
      <div class="card">
        <div class="card flex flex-col gap-y-2 justify-center items-center">
          <p>วันที่เริ่มต้น</p>
          <Calendar class="border" v-model="start_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card flex flex-col mt-2 mb-5 gap-y-2 justify-center items-center">
          <p>วันที่สิ้นสุด</p>
          <Calendar class="border" v-model="end_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div>
          <h1 class="text-lg font-semibold py-1">เลือกหัวเอกสาร</h1>
          <div class="card flex justify-content-center">
            <Dropdown
              @change="refCompany"
              v-model="selectedCompany"
              editable
              :options="cpStore.myCompanies"
              optionLabel="Branch_company_name"
              placeholder="เลือกหัวเอกสาร"
              class="w-full md:w-14rem p-2"
            />
          </div>
        </div>
        <br />
        <Fieldset>
          <template #legend>
            <div
              v-if="selectedCompany"
              class="flex w-full py-2 justify-center items-center pl-2 bg-emerald-600 rounded-lg text-white"
            >
              <Avatar
                v-if="selectedCompany?.Branch_iden_number!=='-'"
                class="w-[75px]"
                :image="`https://drive.google.com/thumbnail?id=${selectedCompany?.Branch_iden_number}`"
                shape="circle"
              />
              <span class="font-bold"
                >{{ selectedCompany?.Branch_company_name }}
                {{
                  selectedCompany?.Branch_iden ? `(${selectedCompany?.Branch_iden})` : ""
                }}
                <Chip
                  class="px-2 text-xs ml-3"
                  :class="selectedCompany?.isVat ? 'bg-yellow-300' : 'hidden'"
                  :label="selectedCompany?.isVat ? 'VAT' : null"
                />
              </span>
            </div>
          </template>
          <br />
          <div v-if="selectedCompany">
            <p class="m-0">
              {{ selectedCompany?.Branch_company_address }}
            </p>
            <p v-if="selectedCompany.isVat" class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            
            <div>
              <h1>เลือกบัญชีธนาคาร</h1>
              <div class="card flex justify-content-center">
                <Dropdown
                  v-model="bank"
                  :options="selectedCompany.bank"
                  optionLabel="name"
                  placeholder="เลือกบัญชีธนาคาร"
                  class="w-full md:w-14rem"
                >
                </Dropdown>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
      <br />
      <hr />
      <br />
      <div class="card">
        <div class="mb-5">
          <h1 class="text-lg font-semibold py-1">เลือกลูกค้า</h1>
          <div class="card flex justify-content-center">
            <Dropdown
              @change="refCustomer"
              v-model="selectedCustomer"
              editable
              :options="customers"
              optionLabel="customer_name"
              placeholder="เลือกลูกค้า"
              class="w-full md:w-14rem p-2"
            />
          </div>
          <br />
          <div
            v-if="customer"
            class="flex w-full py-2 justify-center items-center px-2 bg-gray-200 rounded-lg text-slate-700"
          >
            <span class="font-bold"
              >{{ customer.customer_name }}
              {{ customer.customer_lastname ? `(${customer.customer_lastname})` : "" }}
            </span>
          </div>
        </div>
        <div class="field">
          <label for="customer_name">ชื่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_name"
            v-model="customer.customer_name"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_name }"
          />
          <small class="p-error" v-if="submitted && !customer.customer_name"
            >กรุณาเพิ่มชื่อลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_number">รหัสลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_number"
            v-model.trim="customer.customer_number"
            required="true"
            autofocus
            :class="{ 'p-invalid': !customer.customer_number }"
          />
          <small class="p-error" v-if="!customer.customer_number"
            >กรุณาเพิ่มรหัสลูกค้า</small
          >
        </div>
        <div v-if="selectedCompany?.isVat" class="field">
          <label for="customer_taxnumber">เลขประจำตัวผู้เสีภาษี</label>
          <InputText
            class="p-2"
            id="customer_taxnumber"
            v-model.trim="customer.customer_taxnumber"
            :class="{ 'p-invalid': !customer.customer_taxnumber }"
          />
          <small class="p-error" v-if="!customer.customer_taxnumber"
            >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_phone"
            v-model.trim="customer.customer_phone"
            :class="{ 'p-invalid': !customer.customer_phone }"
          />
          <small class="p-error" v-if="!customer.customer_phone"
            >กรุณาเพิ่มเบอร์ติดต่อลูกค้า</small
          >
        </div>
        <div v-if="selectedCompany?.isVat" class="field">
          <label for="customer_lastname">สำนักงานใหญ่/สาขา</label>
          <InputText
            class="p-2"
            id="customer_lastname"
            v-model.trim="customer.customer_lastname"
          />
        </div>
        <div class="field">
          <label for="customer_position">ที่อยู่ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_position"
            v-model.trim="customer.customer_position"
            :class="{ 'p-invalid': !customer.customer_position }"
          />
          <small class="p-error" v-if="!customer.customer_position"
            >กรุณาเพิ่มที่อยู่ลูกค้า</small>
        </div>
        <div class="field">
          <label for="customer_email">อีเมล์ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_email"
            v-model.trim="customer.customer_email"
          />
        </div>
        <div class="field">
          <div>
            <label for="inventoryStatus" class="mb-3">ประเภทลูกค้า</label>
            <Dropdown
              id="inventoryStatus"
              v-model.trim="customer.customer_type"
              :options="statuses"
              placeholder="เลือกประเภทลูกค้า"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && slotProps.value.value">
                  <Tag
                    :value="slotProps.value.value"
                    :severity="getStatusLabel(slotProps.value.label)"
                  />
                </div>
                <div v-else-if="slotProps.value && !slotProps.value.value">
                  <Tag
                    :value="slotProps.value"
                    :severity="getStatusLabel(slotProps.value)"
                  />
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
            </Dropdown>
          </div>
          <div v-if="selectedCompany?.isVat" class="flex py-4 align-items-center">
            <Checkbox
              v-model="isWithholding"
              inputId="withholding"
              name="withholding"
              :binary="true"
              class="shadow"
            />
            <label for="withholding" class="ml-2"> หัก ณ ที่จ่าย </label>
          </div>
          <div v-if="isWithholding" class="card py-2 flex justify-content-center">
            <Dropdown
              v-model="withholdingPercent"
              :options="percents"
              placeholder="เลือกเปอร์เซ็น"
              class="w-full md:w-14rem"
            />
          </div>
        </div>
        <div class="field">
          <label for="customer_contact">ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact"
            v-model.trim="customer.customer_contact"
            :class="{ 'p-invalid': !customer.customer_contact }"
          />
        </div>
        <div class="field">
          <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            :class="{ 'p-invalid': !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />
      <span class="my-4" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? 'Vat ใน' : 'Vat นอก' }}</span>
      </span>
      <br />
      <div class="card">
        <DataView :value="products">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex justify-between flex-column sm:flex-row sm:items-center p-4 gap-3 border-b"
                  :class="{ 'surface-border': index !== 0 }"
                >
                  <div class="overflow-x-auto w-[120px]">
                    <div v-if="item.product_logo64?.length > 0" class="flex border overflow-x-auto">
                      <div v-for="(pic, index) in item.product_logo64" :key="index" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="pic"
                          :alt="index"
                        />
                      </div>
                    </div>
                    <div v-if="item.product_logo?.length>0" class="flex border overflow-x-auto">
                      <div v-for="(pic, index) in item.product_logo" :key="index" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="`https://drive.google.com/thumbnail?id=${pic}`"
                          :alt="index"
                        />
                      </div>
                    </div>
                  </div>
              
                  <div
                    class="flex flex-column md:flex-row justify-between md:items-center flex-1 gap-4"
                  >
                    <div>
                      <div>
                        <p class="text-clip font-semibold overflow-hidden w-[100px]">
                          {{ item.product_name }}
                        </p>
                        <div class="w-[100px] overflow-y-hidden">
                          <p
                            v-for="(proText, textIndex) in item.product_text"
                            class="text-clip overflow-hidden w-[100px]"
                            :key="textIndex"
                          >
                            {{ proText }}
                          </p>
                        </div>
                        <p
                          class="font-normal text-xs text-clip overflow-hidden w-[100px]"
                        >
                          {{ formatCurrency(item.product_price) }} x
                          {{ item.product_amount }} {{ item.unit }}
                          {{
                            item.vat_price>0 && sumVat ? ' (' + 'VATนอก' + ')' 
                            : item.vat_price>0 && !sumVat ? ' (' + 'VATใน' + ')' 
                            : null 
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency((item.product_amount * item.product_price)+item.vat_price)
                        }}.-</span
                      >
                      <div class="flex h-fit">
                        <Button
                          icon="pi pi-pencil"
                          outlined
                          rounded
                          class="hover:bg-yellow-200"
                          @click="editProduct(item)"
                        ></Button>
                        <Button
                          icon="pi pi-trash"
                          outlined
                          rounded
                          class="hover:bg-red-200"
                          @click="removeProduct(index)"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
      <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
        <Button
          icon="pi pi-plus-circle"
          class="px-2 py-2 w-fit text-lg font-bold text-white"
          label="เพิ่มสินค้า/บริการ"
          @click="
            ()=>{
              openProductForm = true
              product.product_logo64 = []
              product.isVat = false
              product.vat_price = 0
            }
          "
        />
      </div>
      <div
        v-if="openProductForm"
        class="flex flex-col gap-2 w-full py-6 justify-start items-center px-2 bg-gray-200 rounded-lg text-slate-700"
      >
        <div class="card flex justify-center">
          <div class="card">
            <FileUpload name="demo[]" auto @uploader="customBase64Uploader" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload>
                <template #content>
                  <div v-if="product?.product_logo64?.length>0" class="card flex flex-col justify-center">
                    <div class="flex gap-2 w-full pr-5 justify-between h-[100px] items-center" v-for="(pic, index) in product?.product_logo64" :key="index">
                      <Image :src="pic" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo64.splice(index, 1)" class="pi pi-times" style="color: red"></i>
                    </div>
                  </div>
                  <div v-if="product?.product_logo?.length>0" class="card flex flex-col justify-center">
                    <div class="flex gap-2 w-full pr-5 justify-between h-[100px] items-center" v-for="(pic, index) in product?.product_logo" :key="index">
                      <Image :src="`https://drive.google.com/thumbnail?id=${pic}`" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo.splice(index, 1)" class="pi pi-times" style="color: red"></i>
                    </div>
                  </div>
                </template>
            </FileUpload>
          </div>
        </div>
        <div class="field">
          <label class="font-semibold text-lg">หัวข้อย่อย</label>
          <div class="card flex justify-content-center">
            <InputText class="px-2 py-2" v-model="product.product_name" />
          </div>
          <label class="font-semibold py-3 text-lg">รายละเอียด</label>
          <div
            v-for="(text, textInputIndex) in product.product_text"
            class="card flex flex-col gap-y-5 items-center justify-center"
          >
            <Textarea
              v-model="product.product_text[textInputIndex]"
              autoResize
              rows="5"
              cols="50"
              class="border-2 my-2"
            />
          </div>
          <div class="flex gap-2">
            <Button
            label="ลดบรรทัด"
            class="border-gray-400 text-gray-500 hover:bg-red-200 border-2 px-2 py-2"
            @click="product.product_text.pop()"
            :disabled="product.product_text.length < 2"
          />
          <Button
            label="เพิ่มบรรทัดใหม่"
            class="border-orange-300 text-orange-500 hover:bg-orange-200 border-2 px-2 py-2"
            @click="product.product_text.push('')"
          />
          </div>
          
        </div>
        <div class="field grid w-full px-5">
          <div class="field grid">
            <label for="price">ราคา/หน่วย</label>
            <InputNumber
              class="p-2 w-full"
              id="price"
              v-model="product.product_price"
              mode="currency"
              currency="THB"
            />
          </div>
          <div class="field grid">
            <label for="quantity">จำนวน</label>
            <InputNumber
              class="p-2"
              id="quantity"
              v-model="product.product_amount"
              integeronly
            />
          </div>
          <div class="field grid">
            <label for="unit">หน่วย</label>
            <InputText
              class="px-2"
              id="unit"
              v-model="product.unit"
            />
          </div>
          <div v-if="selectedCompany?.isVat" class="flex items-center my-3 gap-2">
            <p>VAT</p>
            <InputSwitch v-model="product.isVat" @change="changeProductVat" />
            <p>{{ product.isVat ? 'มี' : 'ไม่มี' }}</p>
          </div>
          <div class="field gap-3 flex border border-black pl-3 py-1 mt-3 rounded-lg">
            <label for="quantity" class="font-semibold">รวม</label>
            <p class="font-semibold px-2">
              {{ 
                sumVat
                ? formatCurrency((product.product_amount * product.product_price)+product.vat_price) 
                : formatCurrency((product.product_amount * product.product_price)-product.vat_price) 
              }} บาท
            </p>
          </div>
        </div>

        <div class="card flex gap-3 justify-center items-center py-2">
          <Button
            class="py-2 text-center pl-3 pr-5 rounded text-red-500"
            label="ยกเลิก "
            icon="pi pi-times"
            @click="cancleProduct"
          />
          <Button
            class="py-2 text-center px-3 rounded bg-emerald-600 text-white"
            :class="edittingProduct ? 'bg-orange-600' : ''"
            :label="edittingProduct ? 'แก้ไข' : 'เพิ่ม'"
            icon="pi pi-check"
            @click="addProduct"
          />
        </div>
      </div>

      <div class="flex flex-col gap-y-2 px-5 rounded-xl my-3 py-4 bg-slate-200 border-b">
        <p>ส่วนลด</p>
        <InputNumber
          v-model="discount"
          inputId="minmaxfraction"
          :minFractionDigits="2"
          :maxFractionDigits="5"
        />
      </div>

      <div class="flex flex-col gap-y-2">
        
        <span v-if="sumVat"
          >ราคาสินค้า
          <span class="border-b px-2">{{
            formatCurrency(sumProductsPrice) || 0
          }}</span></span
        >
        <span v-if="!sumVat"
          >ราคาสินค้า
          <span class="border-b px-2">{{
            formatCurrency(notSumVatsumProductsPrice) || 0
          }}</span></span
        >
        
        <span
          >ส่วนลด
          <span class="border-b px-2">{{ formatCurrency(discount) || 0 }}</span></span
        >
        <span
          >ราคาหลังหักส่วนลด
          <span class="border-b px-2">{{ formatCurrency(netPrices) || 0 }}</span></span
        >
        <span v-if="selectedCompany?.isVat"
          >VAT 7% <span class="border-b px-2">{{ formatCurrency(vat) || 0 }}</span></span
        >
        <span v-if="selectedCompany?.isVat"
          >ราคารวม VAT
          <span class="border-b px-2">{{ formatCurrency(netVat) || 0 }}</span></span
        >
        <span v-if="isWithholding"
          >หัก ณ ที่จ่าย {{ withholdingPercent }}%
          <span class="border-b px-2">{{
            formatCurrency(withholdingPrice) || 0
          }}</span></span
        >
        <span class="font-bold py-3"
          >ราคาสุทธิ
          <span class="border-b px-2">{{ formatCurrency(allEnd) || 0 }}</span></span
        >
      </div>
      
      <div class="card flex flex-col gap-y-2 py-5 justify-center items-center">
        <p>หมายเหตุ</p>
        <Textarea
          v-for="(mark, mIndex) in remark"
          v-model="remark[mIndex]"
          autoResize
          rows="5"
          cols="30"
        />
        <Button class="px-2 bg-yellow-200" label="เพิ่ม" @click="remark.push('')" />
      </div>

      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="Save"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="editingQuotation"
        />
      </template>
    </Dialog>
    <!--Edit-->

    <Dialog
      v-model:visible="deleteQuotationDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="quotation"
          >คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?<b>{{ quotation.quotation }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          class="py-3"
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteQuotationDialog = false"
        />
        <Button
          class="py-3"
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteQuotation"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteQuotationsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="quotation">คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?</span>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteQuotationsDialog = false"
        />
        <Button
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteSelectedQuotations"
        />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { Documents } from "@/service/ProductService";
import { Customers } from "@/service/Customer";
import { useQuotationStore } from "@/stores/quotation";
import { useCompanyStore } from "@/stores/company";
import DocQuotation from "@/components/Pdf/DocQuotation.vue";
import { copyToClipboard } from "@/functions/Coppy"

const qtStore = useQuotationStore();
const cpStore = useCompanyStore();

onMounted(async () => {
  Documents.getQuotations().then((data) => (quotations.value = data.data.reverse()));
  Customers.getCustomers().then((data) => (customers.value = data.data));
  await cpStore.getMyCompanies();
  await cpStore.getMySignatures();
});

const onCoppy = (value) => {
  console.log(value)
  copyToClipboard(value)
}

const lastRefreshed = ref();
const openQuotation = ref(false);
const loading = ref(false);
const openProductForm = ref(false);
const start_date = ref();
const end_date = ref();
const remark = ref([]);
const withholdingPercent = ref(3);
const isWithholding = ref(false);
const sumVat = ref(true);
const discount = ref(0);
const product = ref({});
const products = ref([]);
const selectedCompany = ref();
const selectedSignature = ref();
const company = ref({});
const toast = useToast();
const dt = ref();
const customer = ref({});
const customers = ref();
const selectedCustomer = ref();
const quotations = ref();
const quotationDialog = ref(false);
const deleteQuotationDialog = ref(false);
const deleteQuotationsDialog = ref(false);
const quotation = ref({});
const selectedQuotations = ref();
const selectedQuotation = ref({});
const uploadfiles = ref([]);
const quotationEditDialog = ref(false);
const color = ref();
const bank = ref({});
const product_head = ref('')
const edittingProduct = ref()
const files = ref([])

const closeHandle = () => {
  openQuotation.value = false
  const body = document.body;
  body.style.backgroundColor = 'aliceblue';   
}

const editProduct = (item) => {
  if(!item) return
  edittingProduct.value = item
  console.log('item',item)
  product.value = item
  product.value.product_logo64 = item.product_logo64 ? item.product_logo64 : []
  product.value.product_logo = item.product_logo
  product.value.isVat = item.vat_price > 0 ? true : false
  openProductForm.value = true
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["Normal", "องค์กร", "หน่วยงานราชการ", "ลูกค้ารายเดือน", "VIP"]);

const percents = ref([3, 5]);

const refresh = () => {
  Documents.getQuotations().then((data) => (quotations.value = data.data.reverse()));

  const currentTimestamp = Date.now();
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    new Date(currentTimestamp)
  );
  lastRefreshed.value = formattedTime;
};

const seeQuotation = (data) => {
  openQuotation.value = true;
  selectedQuotation.value = data;
  console.log("data", selectedQuotation.value);
  const body = document.body;
  body.style.backgroundColor = 'white';
};

const changeProductVat = () => {
  if (product.value.isVat) {

    product.value.vat_price = product.value.product_price*product.value.product_amount*0.07

  } else {

    product.value.vat_price = 0

  }
}

const createNewCustomer = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append("customer_name", customer.value.customer_name);
  formData.append("customer_lastname", customer.value.customer_lastname);
  formData.append("customer_phone", customer.value.customer_phone);
  formData.append("customer_position", customer.value.customer_position);
  formData.append("customer_email", customer.value.customer_email);
  formData.append("customer_type", customer.value.customer_type);
  formData.append("customer_taxnumber", customer.value.customer_taxnumber);
  formData.append("customer_contact", customer.value.customer_contact);
  formData.append("customer_contact_number", customer.value.customer_contact_number);

  const response = await Customers.createNewCustomer(formData);
  if (response.data) {
    toast.add({
      severity: "success",
      summary: "สำเร็จ",
      detail: "เพิ่มลูกค้าใหม่แล้ว",
      life: 3000,
    });
    loading.value = false;
    customerDialog.value = false;
    await Customers.getCustomers().then((data) => (customers.value = data.data));
  } else {
    customerDialog.value = false;
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "เพิ่มลูกค้าใหม่ล้มเหลว",
      life: 3000,
    });
    loading.value = false;
  }
};

const formatDateRef = (isoDateString) => {
  const isoDate = new Date(isoDateString);
  
  // Convert to Buddhist Era (BE) by adding 543 years
  const thaiYear = isoDate.getFullYear() + 543;
  
  const formattedDate = isoDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Construct the final formatted date in "dd/mm/yyyy" format
  const [month, day, year] = formattedDate.split('/');
  const formattedThaiDate = `${day}/${month}/${thaiYear}`;

  return formattedThaiDate;
};

const withholdingPrice = computed(() => {
  if (isWithholding.value && sumVat.value) {
    const result = (netVat.value * withholdingPercent.value) / 100;
    return result;
  } else if (isWithholding.value && !sumVat.value) {
    const result = (netPrices.value * withholdingPercent.value) / 100;
    return result;
  } else {
    return 0;
  }
});

const addProduct = () => {
  if(!product.value) return
  product.value.product_price = sumVat.value
    ? product.value.product_price
    : product.value.product_price - product.value.vat_price;
  if (edittingProduct.value) {
    products.value[edittingProduct.value] = product.value
  } else {
    products.value.push(product.value);
  }
  edittingProduct.value = null
  product.value = {};
  product.value.product_logo64 = [];
  product.value.product_text = [""];
  openProductForm.value = false;
  uploadfiles.value.push(files.value)
  files.value = []
};

const allEnd = computed(() => {
  return netVat.value - withholdingPrice.value;
});

const removeProduct = (index) => {
  if (products.value && products.value.length > 0) {
    products.value.splice(index, 1);
  }
};

const sumProductsPrice = computed(() => {
  if (products.value && products.value.length > 0) {
    const prices = products.value.map((pd) => {
      const result = (pd.product_price * pd.product_amount)
      return result;
    });
    const sumPrices = prices.reduce((a, b) => a + b);
    return sumPrices;
  } else {
    return 0;
  }
});

const notSumVatsumProductsPrice = computed(()=>{
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = sumProductsPrice.value
    return result;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value){
    const result = sumProductsPrice.value
    return result;
  } else {
    return 0;
  }
})

const netPrices = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    return sumProductsPrice.value - discount.value;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value){
    return notSumVatsumProductsPrice.value - discount.value;
  } else {
    return sumProductsPrice.value - discount.value;
  }
});

const vat = computed(() => {
  const all_vat = products.value.map(item=>{
    return item.vat_price
  })
  const result = all_vat.length > 0 ? all_vat.reduce((a,b) => a + b ) : 0
  return result
});

const netVat = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = vat.value + netPrices.value;
    return result;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value){
    const result = vat.value + netPrices.value;
    return result;
  } else {
    return netPrices.value;
  }
});

const cancleProduct = () => {
  if (product.value) {
    product.value = {};
    openProductForm.value = false;
  }
};

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob)

  reader.onloadend = function () {
    const base64data = reader.result
    console.log(product.value)
    console.log(product.value.product_logo64)
    product.value.product_logo64.push(base64data)
  }
  files.value.push(file) 
};

const refCustomer = () => {
  if (selectedCustomer.value) {
    customer.value = selectedCustomer.value;
  }
};

const refCompany = () => {
  if (selectedCompany.value) {
    company.value = selectedCompany.value;
  }
};

const formatCurrency = (value) => {
  if (value) return value.toLocaleString({ style: "currency", currency: "THB" });
  return;
};

const resetData = () => {
  quotation.value = {};
  start_date.value = null;
  end_date.value = null;
  bank.value = {};
  uploadfiles.value = [];
  company.value = {};
  selectedCompany.value = null;
  customer.value = {};
  selectedCustomer.value = null;
  products.value = []
  product.value = {}
  remark.value = []
}

const openNew = () => {
  resetData()
  submitted.value = false;
  quotationDialog.value = true;
  product.value.product_text = [""];
};

const hideDialog = () => {
  product.value = {};
  products.value = [];
  customer.value = {};
  quotationDialog.value = false;
  quotationEditDialog.value = false;
  submitted.value = false;
};

const editQuotation = (prod) => {
  quotation.value = { ...prod };
  console.log("qt", quotation.value);

  start_date.value = prod.start_date;
  end_date.value = prod.end_date;

  const company = cpStore.myCompanies.find(
    (item) => item.Branch_company_name === prod.customer_branch.Branch_company_name
  );
  selectedCompany.value = company;

  const customered = customers.value.find(
    (item) => item.customer_name === prod.customer_detail.customer_name
  );
  selectedCustomer.value = customered;
  refCustomer();

  isWithholding.value = prod.vat.percen_deducted ? true : false;
  withholdingPercent.value = prod.vat.percen_deducted ? prod.vat.percen_deducted : null;
  discount.value = prod.discount;
  products.value = prod.product_detail;
  remark.value = prod.remark;
  bank.value = prod.bank ? company.bank.find((item) => item.number === prod.bank.status) : null;
  selectedSignature.value = cpStore.mySignatures.find((item) => item.name === prod.signature.name);
  product_head.value = prod.product_head || ''
  quotationEditDialog.value = true
  product.value = {}
  product.value.product_text = [""]
  sumVat.value = prod.sumVat
};

const totalPrice = (product) => {
  const price = product.product_detail.map((item)=>{
    return item.product_total - item.vat_price
  })
  const all_price = price.length > 0 ? price.reduce((a,b) => a + b) : 0
  return all_price
}

const totalVat = (product) => {
  const vat = product.product_detail.map((item)=>{
    return item.vat_price
  })
  const result = vat.length > 0 ? vat.reduce((a,b) => a + b) : 0
  return result
}

const confirmDeleteQuotation = (prod) => {
  quotation.value = prod;
  deleteQuotationDialog.value = true;
};

const deleteQuotation = async () => {
  const quotations_to_delete = quotation.value;
  try {
    if (quotations_to_delete) {
      console.log(quotations_to_delete._id);
      await Documents.deleteQuotation(quotations_to_delete._id);
      Documents.getQuotations()
      qtStore.getQuotations()
      refresh()
      quotation.value = {};
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "ลบใบเสนอราคาแล้ว",
        life: 3000,
      });
    }
  }
  catch(err){
    console.log(err)
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบใบเสนอราคาล้มเหลว",
      life: 3000,
    });
  }
  finally {
    deleteQuotationDialog.value = false;
  }
};

const withHolding = (product) => {
  const percent = product.vat.percen_deducted
  const price = totalPrice(product)
  const result = percent > 0 ? price*percent/100 : 0
  return result
}

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteQuotationsDialog.value = true;
};

const deleteSelectedQuotations = async () => {
  try {
    const quotations_to_delete = quotations.value
      .filter((val) => !selectedQuotations.value.includes(val))
  if (
    quotations_to_delete.length > 0 &&
    selectedQuotations.value.length !== quotations.value.length
  ) {
      for (let qt of selectedQuotations.value) {
        console.log(qt._id);
        await Documents.deleteQuotation(qt._id);
      }
  } else if (selectedQuotations.value.length === quotations.value.length) {
    await Documents.deleteQuotations();
  }
    selectedQuotations.value = null;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "ลบใบเสนอราคาแล้ว",
      life: 3000,
    });
  }
  catch (err) {
    console.log(err)
  }
  finally {
    deleteQuotationsDialog.value = false
    loading.value = false
    Documents.getQuotations()
    qtStore.getQuotations()
    refresh()
  }
};

const createNewQuotation = async () => {
  loading.value = true;
  let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = [];
  });

  const data = {
    customer_number: customer.value.customer_number,
    branchId: selectedCompany.value._id,
    signatureID: selectedSignature.value ? selectedSignature.value._id : null,
    customer_detail: {
      tax_id: customer.value.customer_taxnumber,
      customer_name: customer.value.customer_name,
      customer_lastname: customer.value.customer_lastname,
      customer_phone: customer.value.customer_phone,
      customer_email: customer.value.customer_email,
      customer_address: customer.value.customer_position,
      customer_type: customer.value.customer_type,
    },
    product_head: product_head.value || '',
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    bank: {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    },
    isVat: selectedCompany.value.isVat,
    sumVat: sumVat.value
  };
  console.log(data);
  try {
    const response = await Documents.createNewQuotation(data);
    if (response.data) {
      img = response.data.product_detail;
      qtId = response.data._id;
      const imgId = img.map((id) => id._id);
      if (imgId) {
        console.log('uploadfiles',uploadfiles.value)
        uploadfiles.value.forEach(async (file, index) => {
          console.log('file', file)
          const formData = new FormData();
          console.log('file', file)

          for ( let i in file ) {
            formData.append("imgCollection", file[i])
          }

          console.log([...formData])
          const res = await Documents.uploadFileQuotation(imgId[index], qtId, formData);
          qtStore.getQuotations()
          refresh()
          quotationDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "สร้างใบเสนอราคาแล้ว",
            life: 3000,
          });
          loading.value = false;
          quotationDialog.value = false;
          refresh()
        });
      } else {
        qtStore.getQuotations()
        refresh()
        quotationDialog.value = false;
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "สร้างใบเสนอราคาแล้ว",
          life: 3000,
        });
        loading.value = false;
        refresh()
      }
      refresh()
    } else {
      qtStore.getQuotations()
      refresh()
      quotationDialog.value = false;
      toast.add({
        severity: "error",
        summary: "มีบางอย่างผิดพลาด",
        detail: "สร้างใบเสนอราคาล้มเหลว",
        life: 3000,
      });
      quotationDialog.value = false;
      loading.value = false;
      refresh()
    }
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "สร้างใบเสนอราคาแล้ว",
      life: 3000,
    });
    refresh()
  } catch (err) {
    console.log(err);
    quotationDialog.value = false;
    loading.value = false;
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "สร้างใบเสนอราคาล้มเหลว",
      life: 3000,
    });
    refresh()
  }
  quotationDialog.value = false;
  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "สร้างใบเสนอราคาแล้ว",
    life: 3000,
  });
  refresh()
};

const editingQuotation = async () => {
  loading.value = true;
  let img = [];
  let qtId = null;
  console.log(products.value)
  products.value.forEach((product) => {
    product.product_logo64 = [];
  });

  const data = {
    customer_number: customer.value.customer_number,
    branchId: selectedCompany.value._id,
    signatureID: selectedSignature.value ? selectedSignature.value._id : '',
    customer_detail: {
      tax_id: customer.value.customer_taxnumber,
      customer_name: customer.value.customer_name,
      customer_lastname: customer.value.customer_lastname,
      customer_phone: customer.value.customer_phone,
      customer_email: customer.value.customer_email,
      customer_address: customer.value.customer_position,
      customer_type: customer.value.customer_type,
    },
    product_head: product_head.value || '',
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    isVat: selectedCompany.value.isVat,
    bank: bank.value ? {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    } : {
      name:'',
      remark_2: '',
      status: '',
    },
  };
  console.log(data)
  try {
    const response = await Documents.editQuotation(quotation.value._id, data);
  if (response.data) {
    img = response.data.product_detail;
    qtId = response.data._id;
    const imgId = img.map((id) => id._id);
    if (imgId.length > 0 && qtId) {
      console.log('uploadfiles',uploadfiles.value)
      uploadfiles.value.forEach(async (file, index) => {
        const formData = new FormData();
        console.log('file', file)
        for (let i in file) {
          formData.append("imgCollection", file[i]);
        }

        console.log([...formData])

        const res = await Documents.uploadFileQuotation(imgId[index], qtId, formData);
        console.log(res)
        if (res) {
          qtStore
            .getQuotations()
            .then((data) => (quotations.value = data.data.reverse()));
          quotationDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "แก้ไขใบเสนอราคาแล้ว",
            life: 3000,
          });
          loading.value = false;
        }
      });
    } else {
      qtStore.getQuotations()
      refresh()
      quotationEditDialog.value = false;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "แก้ไขใบเสนอราคาแล้ว",
        life: 3000,
      });
      loading.value = false;
    }
  } else {
    quotationEditDialog.value = false;
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "แก้ไขใบเสนอราคาล้มเหลว",
      life: 3000,
    });
    loading.value = false;
  }
  } catch(err){
console.log(err)
  }
  finally {
    loading.value = false;
    quotationEditDialog.value = false;
    refresh()
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "ทั่วไป":
      return "success";

    case "องค์กร":
      return "warning";

    case "หน่วยงานราชการ":
      return "danger";
    default:
      return null;
  }
};

</script>
