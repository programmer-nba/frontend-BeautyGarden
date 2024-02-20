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
            @click="openNew"
          />
          <Button
            label="ลบ"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedReceipts || !selectedReceipts.length"
          />
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
        :value="receipts"
        v-model:selection="selectedReceipts"
        dataKey="_id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="แสดง {first} ถึง {last} จากเอกสารทั้งหมด {totalRecords} ชุด"
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
          field="receipt"
          header="เลขที่"
          sortable
          style="min-width: 12rem"
        ></Column>
        <Column
          field="customer_detail.customer_name"
          header="ชื่อลูกค้า"
          sortable
          style="min-width: 16rem"
        ></Column>
        <Column
          field="start_date"
          header="วันที่เริ่ม"
          sortable
          style="min-width: 10rem"
        ></Column>

        <Column
          field="vat.totalVat_deducted"
          header="ราคา"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            {{
              slotProps.data.total_products
                ? formatCurrency(slotProps.data.total_products?.total_all_end)
                : formatCurrency(slotProps.data.vat?.totalVat_deducted)
            }}
          </template>
        </Column>
        <Column field="total_products" header="VAT 7%" sortable style="min-width: 8rem">
          <template #body="slotProps">
            {{ slotProps.data.total_products ? "VAT" : "-" }}
          </template>
        </Column>
        <Column
          field="vat.percen_deducted"
          header="หัก ณ ที่จ่าย"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ slotProps.data.vat?.percen_deducted ? "หัก ณ ที่จ่าย" : "-" }}
          </template>
        </Column>
        <Column field="status[0]" header="สถานะ" sortable style="min-width: 10rem">
        </Column>
        <Column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="mr-2"
              @click="editReceipt(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteReceipt(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
    v-model:visible="receiptDialog"
    :style="{ width: '450px' }"
    header="ใบเสร็จรับเงิน RECEIPT"
    :modal="true"
    class="p-fluid"
  >
  <div class="card flex flex-col gap-y-2 justify-content-center">
    <Dropdown
      v-model="refQuotation"
      editable
      :options="quotations"
      optionLabel="quotation"
      placeholder="เลือกใบเสนอราคา"
      class="w-full md:w-14rem"
      @change="referQuotation"
    />
  </div>
    <div
      v-if="loading"
      class="card w-full h-full absolute top-1/2 lef-1/2 translate-x-1/2 translate-y-1/2"
    >
      <img src="@/assets/spinner.svg" alt="Spinner" />
    </div>
    <div class="card">
      <div class="card flex flex-col gap-y-2 justify-center items-center">
        <p>วันที่</p>
        <Calendar class="border" v-model="start_date" showButtonBar />
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
              class="w-[75px]"
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
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
          <p class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
          <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
          <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
          <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
          <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
          <br />
          <div>
            <h1>เลือกลายเซ็น</h1>
            <div class="card flex justify-content-center">
              <Dropdown
                v-model="selectedSignature"
                :options="cpStore.mySignatures"
                optionLabel="name"
                placeholder="เลือกลายเซ็น"
                class="w-full md:w-14rem"
              >
                <template #value="slotProps">
                  <div v-if="slotProps.value" class="flex items-center w-[50px]">
                    <img
                      :alt="slotProps.value"
                      :src="`https://drive.google.com/thumbnail?id=${slotProps.value?.image_signature}`"
                      :class="`object-contain mr-4 flag flag-${slotProps.value?.name.toLowerCase()}`"
                    />
                    <div>{{ slotProps.value?.name }}</div>
                  </div>
                  <span v-else>
                    {{ slotProps.placeholder }}
                  </span>
                </template>
                <template #option="slotProps">
                  <div class="flex items-center w-[50px]">
                    <img
                      :alt="slotProps.option"
                      :src="`https://drive.google.com/thumbnail?id=${slotProps.option?.image_signature}`"
                      :class="`object-contain mr-4 flag flag-${slotProps.option?.name.toLowerCase()}`"
                    />
                    <div>{{ slotProps.option?.name }}</div>
                  </div>
                </template>
              </Dropdown>
            </div>
          </div>
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
          <div v-if="customer.profile_image" class="mr-4">
            <Avatar
              class="object-contain w-[50px] h-[50px]"
              :image="`https://drive.google.com/thumbnail?id=${customer.profile_image}`"
              shape="circle"
            />
          </div>
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
          :class="{ 'p-invalid': submitted && !customer.customer_number }"
        />
        <small class="p-error" v-if="submitted && !customer.customer_number"
          >กรุณาเพิ่มรหัสลูกค้า</small
        >
      </div>

      <div class="field">
        <label for="customer_taxnumber">เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน</label>
        <InputText
          class="p-2"
          id="customer_taxnumber"
          v-model.trim="customer.customer_taxnumber"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_taxnumber }"
        />
        <small class="p-error" v-if="submitted && !customer.customer_taxnumber"
          >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
        >
      </div>
      <div class="field">
        <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
        <InputText
          class="p-2"
          id="customer_phone"
          v-model.trim="customer.customer_phone"
          required="false"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_phone }"
        />
        <small class="p-error" v-if="submitted && !customer.customer_phone"
          >เบอร์ติดต่อลูกค้า</small
        >
      </div>
      <div class="field">
        <label for="customer_lastname">สำนักงานใหญ่/สาขา</label>
        <InputText
          class="p-2"
          id="customer_lastname"
          v-model.trim="customer.customer_lastname"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_lastname }"
        />
      </div>
      <div class="field">
        <label for="customer_position">ที่อยู่ลูกค้า</label>
        <InputText
          class="p-2"
          id="customer_position"
          v-model.trim="customer.customer_position"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_position }"
        />
      </div>
      <div class="field">
        <label for="customer_email">อีเมล์ลูกค้า</label>
        <InputText
          class="p-2"
          id="customer_email"
          v-model.trim="customer.customer_email"
          required="false"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_email }"
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

        <div class="flex py-2 align-items-center">
          <Checkbox
            v-model="isWithholding"
            inputId="ingredient1"
            name="pizza"
            :binary="true"
          />
          <label for="ingredient1" class="ml-2"> หัก ณ ที่จ่าย </label>
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
          required="false"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_contact }"
        />
      </div>
      <div class="field">
        <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
        <InputText
          class="p-2"
          id="customer_contact_number"
          v-model.trim="customer.customer_contact_number"
          required="false"
          autofocus
          :class="{ 'p-invalid': submitted && !customer.customer_contact_number }"
        />
      </div>
    </div>
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
                <div class="w-[75px] relative">
                  <img
                    v-if="item.product_logo64"
                    class="object-contain block xl:block mx-auto border-round w-full"
                    :src="item.product_logo64"
                    :alt="index"
                  />
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
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-column md:align-items-end gap-5">
                    <span class="text-xl font-semibold text-900"
                      >{{
                        formatCurrency(item.product_price * item.product_amount)
                      }}.-</span
                    >
                    <div class="flex flex-row-reverse md:flex-row gap-2">
                      <Button
                        icon="pi pi-trash"
                        outlined
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
      <span
        >ราคาสินค้า
        <span class="border-b px-2">{{
          formatCurrency(sumProductsPrice) || 0
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
    <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
      <Button
        icon="pi pi-plus-circle"
        class="px-2 py-2 w-fit text-lg font-bold text-white"
        label="เพิ่มสินค้า/บริการ"
        @click="openProductForm = true"
      />
    </div>

    <div
      v-if="openProductForm"
      class="flex flex-col gap-2 w-full py-6 justify-start items-center px-2 bg-gray-200 rounded-lg text-slate-700"
    >
      <div v-if="product?.product_logo64" class="card flex justify-content-center">
        <Image :src="product?.product_logo64" alt="Image" width="250" preview />
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
      <div class="field">
        <label>หัวข้อ</label>
        <div class="card flex justify-content-center">
          <InputText v-model="product.product_name" />
        </div>
        <label>รายละเอียด</label>
        <div
          v-for="(text, textInputIndex) in product.product_text"
          class="card flex justify-content-center"
        >
          <Textarea
            v-model="product.product_text[textInputIndex]"
            autoResize
            rows="5"
            cols="50"
          />
        </div>
        <Button
          label="add"
          class="bg-orange-300 px-2"
          @click="product.product_text.push('')"
        />
      </div>
      <div class="field grid w-full px-5">
        <div class="field grid">
          <label for="price">ราคา/หน่วย</label>
          <InputNumber
            class="p-2"
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
          <label for="quantity">รวม</label>
          <p class="font-semibold px-2">
            {{ formatCurrency(product.product_amount * product.product_price) }} บาท
          </p>
        </div>
      </div>

      <div class="card flex gap-3 justify-center items-center py-2">
        <Button
          class="py-2 text-center pl-3 pr-5 rounded bg-red-600 text-white"
          label="ยกเลิก "
          icon="pi pi-times"
          @click="cancleProduct"
        />
        <Button
          class="py-2 text-center px-3 rounded bg-emerald-600 text-white"
          label="เพิ่ม"
          icon="pi pi-check"
          @click="addProduct"
        />
      </div>
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
        @click="createNewReceipt"
      />
    </template>
  </Dialog>

    <Dialog
      v-model:visible="receiptDialogx"
      :style="{ width: '450px' }"
      header="Receipt Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="card flex flex-col gap-y-2 justify-content-center">
        <Dropdown
          v-model="refQuotation"
          editable
          :options="quotations"
          optionLabel="quotation"
          placeholder="เลือกใบเสนอราคา"
          class="w-full md:w-14rem"
          @change="referQuotation"
        />
      </div>
      <div
        v-if="loading"
        class="card w-full h-full absolute top-1/2 lef-1/2 translate-x-1/2 translate-y-1/2"
      >
        <img src="@/assets/spinner.svg" alt="Spinner" />
      </div>
      <div class="card flex flex-col gap-y-2 justify-center items-center">
        <p>วันที่</p>
        <Calendar class="border" v-model="start_date" showButtonBar />
      </div>
      <div class="card">
        <div>
          <h1 class="text-lg font-semibold py-1">เลือกหัวเอกสาร</h1>
          <div class="card flex justify-center">
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
                class="w-[75px]"
                image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
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
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            <div>
              <h1>เลือกลายเซ็น</h1>
              <div class="card flex justify-content-center">
                <Dropdown
                  v-model="selectedSignature"
                  :options="cpStore.mySignatures"
                  optionLabel="name"
                  placeholder="เลือกลายเซ็น"
                  class="w-full md:w-14rem"
                >
                  <template #value="slotProps">
                    <div v-if="slotProps.value" class="flex items-center w-[50px]">
                      <img
                        :alt="slotProps.value"
                        :src="`https://drive.google.com/thumbnail?id=${slotProps.value?.image_signature}`"
                        :class="`object-contain mr-4 flag flag-${slotProps.value?.name.toLowerCase()}`"
                      />
                      <div>{{ slotProps.value?.name }}</div>
                    </div>
                    <span v-else>
                      {{ slotProps.placeholder }}
                    </span>
                  </template>
                  <template #option="slotProps">
                    <div class="flex items-center w-[50px]">
                      <img
                        :alt="slotProps.option"
                        :src="`https://drive.google.com/thumbnail?id=${slotProps.option?.image_signature}`"
                        :class="`object-contain mr-4 flag flag-${slotProps.option?.name.toLowerCase()}`"
                      />
                      <div>{{ slotProps.option?.name }}</div>
                    </div>
                  </template>
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
            <div v-if="customer.profile_image" class="mr-4">
              <Avatar
                class="object-contain w-[50px] h-[50px]"
                :image="`https://drive.google.com/thumbnail?id=${customer.profile_image}`"
                shape="circle"
              />
            </div>
            <span class="font-bold"
              >{{ customer.customer_name }}
              {{ customer.customer_lastname ? `(${customer.customer_lastname})` : "" }}
            </span>
          </div>
        </div>

        <div class="field">
          <label for="customer_number">รหัสลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_number"
            v-model.trim="customer.customer_number"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_number }"
          />
          <small class="p-error" v-if="submitted && !customer.customer_number"
            >กรุณาเพิ่มรหัสลูกค้า</small
          >
        </div>

        <div class="field">
          <label for="customer_taxnumber">เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน</label>
          <InputText
            class="p-2"
            id="customer_taxnumber"
            v-model.trim="customer.customer_taxnumber"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_taxnumber }"
          />
          <small class="p-error" v-if="submitted && !customer.customer_taxnumber"
            >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_phone"
            v-model.trim="customer.customer_phone"
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_phone }"
          />
          <small class="p-error" v-if="submitted && !customer.customer_phone"
            >เบอร์ติดต่อลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_lastname">สำนักงานใหญ่/สาขา</label>
          <InputText
            class="p-2"
            id="customer_lastname"
            v-model.trim="customer.customer_lastname"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_lastname }"
          />
        </div>
        <div class="field">
          <label for="customer_position">ที่อยู่ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_position"
            v-model.trim="customer.customer_position"
            required="true"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_position }"
          />
        </div>
        <div class="field">
          <label for="customer_email">อีเมล์ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_email"
            v-model.trim="customer.customer_email"
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_email }"
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
          <div class="flex py-2 align-items-center">
            <Checkbox
              v-model="isWithholding"
              inputId="ingredient1"
              name="pizza"
              :binary="true"
            />
            <label for="ingredient1" class="ml-2"> หัก ณ ที่จ่าย </label>
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
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_contact }"
          />
        </div>
        <div class="field">
          <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_contact_number }"
          />
        </div>
      </div>
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
                  <div
                    class="flex flex-column md:flex-row justify-between md:items-center flex-1 gap-4"
                  >
                    <div>
                      <p class="text-clip font-semibold overflow-hidden w-[100px]">
                        {{ item.product_name }}
                      </p>
                      <p class="text-clip overflow-hidden w-[100px]">
                        {{ item.product_text }}
                      </p>
                      <p class="font-normal text-xs text-clip overflow-hidden w-[100px]">
                        {{ formatCurrency(item.product_price) }} x
                        {{ item.product_amount }}
                      </p>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency(item.product_price * item.product_amount)
                        }}.-</span
                      >
                      <div class="flex flex-row-reverse md:flex-row gap-2">
                        <Button
                          class="text-orange-500"
                          icon="pi pi-bars"
                          outlined
                          @click="removeProduct(index)"
                        ></Button>
                        <Button
                          class="text-red-500"
                          icon="pi pi-trash"
                          outlined
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
        <div class="flex flex-col gap-y-2">
          <span>ราคาสินค้า {{ sumProductsPrice }}</span>
          <span>ส่วนลด {{ discount }}</span>
          <span>ราคาหลังหักส่วนลด {{ netPrices }}</span>
          <span>VAT 7% {{ vat }}</span>
          <span>ราคารวม VAT {{ netVat }}</span>
          <span v-if="isWithholding"
            >หัก ณ ที่จ่าย {{ withholdingPercent }}% {{ withholdingPercent }}</span
          >
          <span>ราคารวม VAT {{ allEnd }}</span>
        </div>
      </div>

      <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
        <Button
          icon="pi pi-plus-circle"
          class="px-2 py-2 w-fit text-lg font-bold text-white"
          label="เพิ่มสินค้า/บริการ"
          @click="openProductForm = true"
        />
      </div>

      <div
        v-if="openProductForm"
        class="flex flex-col gap-2 w-full py-6 justify-start items-center px-2 bg-gray-200 rounded-lg text-slate-700"
      >
        <div class="field">
          <label>หัวข้อ</label>
          <div class="card flex justify-content-center">
            <InputText v-model="product.product_name" />
          </div>
          <label>รายละเอียด</label>
          <div class="card flex justify-content-center">
            <Textarea v-model="product.product_text" autoResize rows="5" cols="50" />
          </div>
        </div>
        <div class="field grid w-full px-5">
          <div class="field grid">
            <label for="price">ราคา/หน่วย</label>
            <InputNumber
              class="p-2"
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
            <label for="quantity">รวม</label>
            <p class="font-semibold px-2">
              {{ formatCurrency(product.product_amount * product.product_price) }} บาท
            </p>
          </div>
        </div>

        <div class="card flex gap-3 justify-center items-center py-2">
          <Button
            class="py-2 text-center pl-3 pr-5 rounded bg-red-600 text-white"
            label="ยกเลิก "
            icon="pi pi-times"
            @click="cancleProduct"
          />
          <Button
            class="py-2 text-center px-3 rounded bg-emerald-600 text-white"
            label="เพิ่ม"
            icon="pi pi-check"
            @click="addProduct"
          />
        </div>
      </div>

      <div class="card flex flex-col gap-y-2 py-5 justify-center items-center">
        <p>หมายเหตุ</p>
        <Textarea v-model="remark" autoResize rows="5" cols="30" />
      </div>

      <template #footer>
        <div class="flex gap-3 py-5">
          <Button label="ยกเลิก" icon="pi pi-times" text @click="hideDialog" />
          <Button
            label="บันทึก"
            icon="pi pi-check"
            :loading="loading"
            text
            @click="createNewReceipt"
          />
        </div>
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteReceiptDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="receipt"
          >คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?<b>{{ receipt.receipt }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          class="py-3"
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteReceiptDialog = false"
        />
        <Button
          class="py-3"
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteReceipt"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteReceiptsDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="receipt">คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?</span>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteReceiptsDialog = false"
        />
        <Button label="ยืนยัน" icon="pi pi-check" text @click="deleteSelectedReceipts" />
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
import { useReceiptStore } from "@/stores/receipt";
import { useCompanyStore } from "@/stores/company";

const reStore = useReceiptStore();
const cpStore = useCompanyStore();

onMounted(async () => {
  Documents.getReceipts().then((data) => (receipts.value = data.data));
  Documents.getQuotations().then((data) => (quotations.value = data.data));
  Customers.getCustomers().then((data) => (customers.value = data.data));
  await cpStore.getMyCompanies();
  await cpStore.getMySignatures();
});

const quotations = ref();
const refQuotation = ref();
const loading = ref(false);
const openProductForm = ref(false);
const start_date = ref();
const remark = ref();
const bank = ref({})
const banks = ref()
const withholdingPercent = ref(3);
const isWithholding = ref(false);
const sumVat = ref(true);
const discount = ref(0);
const product = ref({});
const products = ref([]);
const selectedCompany = ref();
const selectedSignature = ref();
const company = ref({});
const signature = ref({});
const toast = useToast();
const dt = ref();
const customer = ref({});
const customers = ref();
const selectedCustomer = ref();
const receipts = ref();
const receiptDialog = ref(false);
const deleteReceiptDialog = ref(false);
const deleteReceiptsDialog = ref(false);
const receipt = ref({});
const selectedReceipts = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["ทั่วไป", "องค์กร", "หน่วยงานราชการ", "VIP"]);

const percents = ref([3, 5]);

const withholdingPrice = computed(() => {
  if (isWithholding.value) {
    const result = (netPrices.value * withholdingPercent.value) / 100;
    return result;
  } else {
    return 0;
  }
});

const referQuotation = () => {
    if(refQuotation.value){
        console.log('rfQT', refQuotation.value)
        customer.value.customer_taxnumber = refQuotation.value.customer_detail.tax_id
        customer.value.customer_name = refQuotation.value.customer_detail.customer_name
        customer.value.customer_lastname = refQuotation.value.customer_detail.customer_lastname
        customer.value.customer_phone = refQuotation.value.customer_detail.customer_phone
        customer.value.customer_email = refQuotation.value.customer_detail.customer_email
        customer.value.customer_position = ''
        customer.value.customer_type = refQuotation.value.customer_detail.customer_type
        selectedCustomer.value = customer.value
        selectedCompany.value = refQuotation.value.customer_branch
        start_date.value = refQuotation.value.start_date
        products.value = refQuotation.value.product_detail
        discount.value = refQuotation.value.discount
        selectedSignature.value = refQuotation.value.signature
    }
}

const addProduct = () => {
  if (product.value) {
    products.value.push(product.value);
    product.value = {};
    openProductForm.value = false;
  }
};

const removeProduct = (index) => {
  if (products.value && products.value.length > 0) {
    products.value.splice(index, 1);
  }
};

const sumProductsPrice = computed(() => {
  if (products.value && products.value.length > 0) {
    const prices = products.value.map((pd) => {
      const result = pd.product_price * pd.product_amount;
      return result;
    });
    const sumPrices = prices.reduce((a, b) => a + b);
    return sumPrices;
  } else {
    return 0;
  }
});

const netPrices = computed(() => {
  return sumProductsPrice.value - discount.value;
});

const vat = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = netPrices.value * 0.07;
    return result;
  } else {
    return 0;
  }
});

const netVat = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = vat.value + netPrices.value;
    return result;
  } else {
    return netPrices.value;
  }
});

const allEnd = computed(() => {
  return netVat.value - withholdingPrice.value;
});

const cancleProduct = () => {
  if (product.value) {
    product.value = {};
    openProductForm.value = false;
  }
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

const refSignature = () => {
  if (selectedSignature.value) {
    signature.value = selectedSignature.value;
  }
};

const formatCurrency = (value) => {
  if (value) return value.toLocaleString({ style: "currency", currency: "THB" });
  return;
};
const openNew = () => {
  receipt.value = {};
  submitted.value = false;
  receiptDialog.value = true;
};
const hideDialog = () => {
  product.value = {};
  products.value = [];
  customer.value = {};
  receiptDialog.value = false;
  submitted.value = false;
};

const editReceipt = (prod) => {
  receipt.value = { ...prod };
  receiptDialog.value = true;
};
const confirmDeleteReceipt = (prod) => {
  receipt.value = prod;
  deleteReceiptDialog.value = true;
};
const deleteReceipt = async () => {
  const receipts_to_delete = receipt.value;
  if (receipts_to_delete) {
    console.log(receipts_to_delete._id);
    await Documents.deleteReceipt(receipts_to_delete._id);
  }
  await Documents.getReceipts().then((data) => (receipts.value = data.data));
  reStore.getReceipts();
  deleteReceiptDialog.value = false;
  receipt.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "ลบใบเสนอราคาแล้ว",
    life: 3000,
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deleteReceiptsDialog.value = true;
};

const deleteSelectedReceipts = async () => {
  const receipts_to_delete = receipts.value.filter(
    (val) => !selectedReceipts.value.includes(val)
  );
  console.log(selectedReceipts.value.length);
  console.log(receipts_to_delete.length);
  if (
    receipts_to_delete.length > 0 &&
    selectedReceipts.value.length !== receipts.value.length
  ) {
    for (let qt of selectedReceipts.value) {
      console.log(qt._id);
      await Documents.deleteReceipt(qt._id);
    }
  } else if (selectedReceipts.value.length === receipts.value.length) {
    await Documents.deleteReceipts();
  }
  await Documents.getReceipts().then((data) => (receipts.value = data.data));
  reStore.getReceipts();
  deleteReceiptsDialog.value = false;
  selectedReceipts.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "ลบใบเสนอราคาแล้ว",
    life: 3000,
  });
};

const createNewReceipt = async () => {
  loading.value = true;
  let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  });

  const data = {
    customer_number: customer.value.customer_number,
    branchId: selectedCompany.value._id,
    signatureID: selectedSignature.value._id,
    customer_detail: {
      tax_id: customer.value.customer_taxnumber,
      customer_name: customer.value.customer_name,
      customer_lastname: customer.value.customer_lastname,
      customer_phone: customer.value.customer_phone,
      customer_email: customer.value.customer_email,
      customer_address: customer.value.customer_position,
      customer_type: customer.value.customer_type,
    },
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding ? withholdingPercent.value : 0,
    percen_payment: isWithholding ? withholdingPercent.value : 0,
    start_date: start_date.value,
    remark: remark.value,
    bank: {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number
    },
    isVat: selectedCompany.value.isVat,
    sumVat: sumVat.value
  };
  console.log(data);
  const response = await Documents.createNewReceipt(data);
  if (response.data) {
    receiptDialog.value = false;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "สร้างใบเสร็จแล้ว",
      life: 3000,
    });
    loading.value = false;
    reStore.getReceipts();
  } else {
    receiptDialog.value = false;
    toast.add({
      severity: "danger",
      summary: "มีบางอย่างผิดพลาด",
      detail: "สร้างใบเสนอราคาล้มเหลว",
      life: 3000,
    });
    loading.value = false;
    reStore.getReceipts();
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


<div class="card flex flex-col gap-y-2 justify-content-center">
  <Dropdown
    v-model="refQuotation"
    editable
    :options="quotations"
    optionLabel="quotation"
    placeholder="เลือกใบเสนอราคา"
    class="w-full md:w-14rem"
    @change="referQuotation"
  />
</div>

const referQuotation = () => {
  if(refQuotation.value){
    console.log('rfQT', refQuotation.value)   
    customer.value.customer_taxnumber = refQuotation.value.customer_detail.tax_id
    customer.value.customer_name = refQuotation.value.customer_detail.customer_name
    customer.value.customer_lastname = refQuotation.value.customer_detail.customer_lastname
    customer.value.customer_phone = refQuotation.value.customer_detail.customer_phone
    customer.value.customer_email = refQuotation.value.customer_detail.customer_email
    customer.value.customer_position = ''
    customer.value.customer_type = refQuotation.value.customer_detail.customer_type
    selectedCustomer.value = customer.value
    selectedCompany.value = cpStore.myCompanies.find((item)=>item.Branch_company_name === refQuotation.value.customer_branch.Branch_company_name)
    company.value = selectedCompany.value
    products.value = refQuotation.value.product_detail
    discount.value = refQuotation.value.discount
    selectedSignature.value = refQuotation.value.signature
    bank.value = company.value.bank.find((item) => item.number === refQuotation.value.bank.status);
    console.log('bank', bank.value)
    console.log('company', company.value)
  }
}
