<template>
  <div class="h-full">
    <Toast />
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openReceipt"
    >
      <DocReceiptRef :color="color" :data="selectedReceipt" @close="closeHandle" />
    </div>

    <div v-if="!openReceipt" class="card">
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
            label="เพิ่มจากใบแจ้งหนี้"
            icon="pi pi-plus"
            severity="success"
            class="mr-4"
            @click="openNewRef"
          />
          <Button
            label="ลบ"
            icon="pi pi-trash"
            severity="danger"
            @click="confirmDeleteSelected"
            :disabled="!selectedReceipts || !selectedReceipts.length"
          />
          <Button icon="pi pi-refresh" @click="refresh" />
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
          <ColorPicker class="px-3" v-model="color" />
          {{ color }}
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
          field="receipt"
          header="เลขที่"
          sortable
          style="min-width: 12rem"
          class="border-b"
        >
        </Column>
        <Column
          field="invoice"
          header="อ้างอิง"
          sortable
          style="min-width: 12rem"
          class="border-b"
        >
          <template #body="slotProps">
            {{ slotProps.data.invoice }}
            {{
              slotProps.data.invoiceRef_detail &&
              slotProps.data.invoiceRef_detail?.period_text
                ? `(${slotProps.data.invoiceRef_detail?.period_text})`
                : null
            }}
          </template>
        </Column>
        <Column
          field="customer_detail.customer_name"
          header="ชื่อลูกค้า"
          sortable
          style="min-width: 16rem"
          class="border-b"
        ></Column>
        <Column
          field="start_date"
          header="วันที่ออกเอกสาร"
          class="border-b"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            {{ formatDateRef(slotProps.data.start_date) }}
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
            <span v-if="slotProps.data.amount_price >= 0 && slotProps.data.invoice">
              {{ formatCurrency(slotProps.data.amount_price) }}
            </span>
            <span v-else>
              {{
                slotProps.data.sumVat
                  ? formatCurrency(
                      totalPrice(slotProps.data) -
                        slotProps.data.discount +
                        totalVat(slotProps.data) -
                        withHolding(slotProps.data)
                    )
                  : formatCurrency(
                      totalPrice(slotProps.data) -
                        slotProps.data.discount +
                        totalVat(slotProps.data) -
                        withHolding(slotProps.data)
                    )
              }}
            </span>
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
              <span
                class="text-sm text-center"
                :class="
                  slotProps.data.customer_branch.isVat ? 'bg-yellow-200 rounded p-1' : ''
                "
              >
                {{
                  slotProps.data.customer_branch.isVat && slotProps.data.sumVat
                    ? "VAT นอก"
                    : slotProps.data.customer_branch.isVat && !slotProps.data.sumVat
                    ? "VAT ใน"
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
              <span
                class="text-sm text-center"
                :class="slotProps.data.vat?.percen_deducted ? 'text-orange-500' : ''"
              >
                {{ slotProps.data.vat?.percen_deducted ? "หัก ณ ที่จ่าย" : "-" }}
              </span>
            </div>
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 10rem" class="border-b">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-1 justify-center items-center">
              <Button
                class="text-blue-600 hover:bg-blue-100"
                icon="pi pi-file"
                outlined
                rounded
                @click="seeReceipt(slotProps.data)"
              />
              <Button
                class="text-yellow-600 hover:bg-orange-100"
                icon="pi pi-pencil"
                outlined
                rounded
                @click="editReceipt(slotProps.data)"
              />
              <Button
                class="text-red-600 hover:bg-red-100"
                icon="pi pi-trash"
                outlined
                rounded
                @click="confirmDeleteReceipt(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="receiptDialog"
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
          placeholder="เลือกใบเสนอราคา (ถ้ามี)"
          class="w-full md:w-14rem"
          @input="referQuotationInput"
          @change="referQuotation"
        />
      </div>
      <div class="card">
        <div class="card flex flex-col gap-y-2 justify-center items-center">
          <p>วันที่เริ่มต้น</p>
          <Calendar
            class="border"
            v-model="start_date"
            showButtonBar
            dateFormat="dd/mm/yy"
          />
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
                v-if="selectedCompany?.Branch_iden_number !== '-'"
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
            <p class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            <!-- <div>
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
            </div> -->
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

      <span class="my-2" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? "Vat ใน" : "Vat นอก" }}</span>
      </span>

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
                          {{ item.product_amount }}
                          {{
                            item.vat_price > 0 && sumVat
                              ? " (" + "VATนอก" + ")"
                              : item.vat_price > 0 && !sumVat
                              ? " (" + "VATใน" + ")"
                              : null
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency(
                            item.product_amount * item.product_price + item.vat_price
                          )
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

      <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
        <Button
          icon="pi pi-plus-circle"
          class="px-2 py-2 w-fit text-lg font-bold text-white"
          label="เพิ่มสินค้า/บริการ"
          @click="
            () => {
              openProductForm = true;
              product.isVat = false;
              product.vat_price = 0;
            }
          "
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
          <div class="flex items-center gap-2">
            <p>VAT</p>
            <InputSwitch v-model="product.isVat" @change="changeProductVat" />
          </div>
          <div class="field grid">
            <label for="quantity">รวม</label>
            <p class="font-semibold px-2">
              {{
                sumVat
                  ? formatCurrency(
                      product.product_amount * product.product_price + product.vat_price
                    )
                  : formatCurrency(
                      product.product_amount * product.product_price - product.vat_price
                    )
              }}
              บาท
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
          @click="createNewReceipt"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="receiptEditDialog"
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
          placeholder="เลือกใบเสนอราคา (ถ้ามี)"
          class="w-full md:w-14rem"
          @input="referQuotationInput"
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
          <p>วันที่เริ่มต้น</p>
          <Calendar
            class="border"
            v-model="start_date"
            showButtonBar
            dateFormat="dd/mm/yy"
          />
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
                v-if="selectedCompany?.Branch_iden_number !== '-'"
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
            <p class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            <!-- <div>
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
            </div> -->
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

      <span class="my-2" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? "Vat ใน" : "Vat นอก" }}</span>
      </span>

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
                          {{ item.product_amount }}
                          {{
                            item.vat_price > 0 && sumVat
                              ? " (" + "VATนอก" + ")"
                              : item.vat_price > 0 && !sumVat
                              ? " (" + "VATใน" + ")"
                              : null
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency(
                            item.product_amount * item.product_price + item.vat_price
                          )
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

      <div class="bg-orange-500 rounded-lg w-full flex justify-center my-2">
        <Button
          icon="pi pi-plus-circle"
          class="px-2 py-2 w-fit text-lg font-bold text-white"
          label="เพิ่มสินค้า/บริการ"
          @click="
            () => {
              openProductForm = true;
              product.isVat = false;
              product.vat_price = 0;
            }
          "
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
          <div class="flex items-center gap-2">
            <p>VAT</p>
            <InputSwitch v-model="product.isVat" @change="changeProductVat" />
          </div>
          <div class="field grid">
            <label for="quantity">รวม</label>
            <p class="font-semibold px-2">
              {{
                sumVat
                  ? formatCurrency(
                      product.product_amount * product.product_price + product.vat_price
                    )
                  : formatCurrency(
                      product.product_amount * product.product_price - product.vat_price
                    )
              }}
              บาท
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
          @click="editingReceipt"
        />
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

    <Dialog
      v-model:visible="receiptRefInvoiceDialog"
      :style="{ width: '500px' }"
      header="Receipt Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="card flex flex-col gap-y-2 bg-sky-300 py-2 px-2 rounded-lg justify-content-center">
        <Dropdown
          v-model="refInvoice"
          editable
          :options="invoices"
          optionLabel="invoice"
          placeholder="เลือกใบแจ้งหนี้"
          class="w-full md:w-14rem"
        />
      </div>
      <div class="card">
        <div class="card flex flex-col gap-y-2 justify-center items-center py-3">
          <p>วันที่ออกใบเสร็จ</p>
          <Calendar
            class="border rounded-sm"
            v-model="start_date"
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </div>
        <div>
          <p>
            <strong>บริษัท : </strong
            >{{ refInvoice?.customer_branch?.Branch_company_name }}
          </p>
          <p>
            <strong>ลูกค้า : </strong>{{ refInvoice?.customer_detail?.customer_name }}
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 py-4">
          <div class="flex align-items-center">
              <RadioButton class=" bg-green-900 rounded-full" v-model="transfer" inputId="cash" name="cash" value="cash" />
              <label for="ingredient1" class="ml-2">เงินสด</label>
          </div>
          <div class="flex align-items-center">
              <RadioButton class=" bg-green-900 rounded-full" v-model="transfer" inputId="bank" name="bank" value="bank" />
              <label for="ingredient2" class="ml-2">โอนผ่านบัญชีธนาคาร</label>
          </div>
        </div>
        <div class="flex gap-3 justify-start items-center" v-if="transfer==='bank' && refInvoice && refInvoice.bank.name">
          <small>{{ refInvoice?.bank.name }} ({{ refInvoice?.bank.remark_2 }})</small>
          <small>{{ refInvoice?.bank.status }}</small>
        </div>
        <div class="py-3">
          <strong>จำนวนเงิน</strong>
          <InputGroup class="border rounded">
            <InputGroupAddon><span class="font-bold px-2">THB</span></InputGroupAddon>
            <InputNumber v-model="amount_price" />
            <InputGroupAddon>บาท</InputGroupAddon>
          </InputGroup>
        </div>
        <div class="card flex flex-col gap-y-2 py-5 justify-center items-center">
          <p class="hover:text-orange-500 cursor-pointer px-2 py-2 border rounded hover:border-orange-300 duration-300" @click="remark.push('')">หมายเหตุ</p>
          <Textarea
            v-for="(mark, mIndex) in remark"
            v-model="remark[mIndex]"
            autoResize
            rows="5"
            cols="30"
            class="my-2 border"
          />
          <p v-if="remark.length>0" @click="remark.pop()" class="text-red-500 cursor-pointer">ลบ</p>
        </div>
      </div>
      <template #footer>
        <div class="flex gap-3">
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            text
            @click="hideDialog"
            class="text-bold text-red-500 py-2 px-2"
            :loading="loading"
          />
          <Button
            label="บันทึก"
            icon="pi pi-check"
            :loading="loading"
            text
            rounded
            @click="createNewReceiptRefInvoice"
            class="text-bold text-green-500 hover:bg-green-100 border border-green-500 px-3"
          />
        </div>
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
import DocReceiptRef from "@/components/Pdf/DocReceiptRef.vue";

const reStore = useReceiptStore();
const cpStore = useCompanyStore();

onMounted(async () => {
  Documents.getReceipts().then((data) => (receipts.value = data.data.reverse()));
  Documents.getQuotations().then((data) => (quotations.value = data.data));
  Customers.getCustomers().then((data) => (customers.value = data.data));
  await cpStore.getMyCompanies();
  await cpStore.getMySignatures();
  await fetchInvoices();
});

const transfer = ref('bank')
const quotations = ref([]);
const lastRefreshed = ref();
const openReceipt = ref(false);
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
const receipts = ref();
const receiptDialog = ref(false);
const deleteReceiptDialog = ref(false);
const deleteReceiptsDialog = ref(false);
const receipt = ref({});
const selectedReceipts = ref();
const selectedReceipt = ref({});
const uploadfiles = ref([]);
const receiptEditDialog = ref(false);
const color = ref();
const bank = ref({});
const refQuotation = ref();

// Create with reference invoice
const amount_price = ref();
const invoices = ref([]);
const refInvoice = ref();
const receiptRefInvoiceDialog = ref(false);

function openNewRef() {
  resetRefInvoice();
  receiptRefInvoiceDialog.value = true;
}

function resetRefInvoice() {
  refInvoice.value = null;
}

async function fetchInvoices() {
  try {
    const response = await Documents.getInvoices();
    invoices.value = response.data;
  } catch (error) {
    invoices.value = [];
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด !",
      detail: "ไม่สามารถรับข้อมูลใบแจ้งหนี้ได้",
      life: 3000,
    });
    console.log(error);
  }
}

async function createNewReceiptRefInvoice() {
  loading.value = true;
  const data = {
    invoiceId: refInvoice.value ? refInvoice.value.invoice : null,
    start_date: start_date.value || new Date(),
    amount_price: amount_price.value || 0,
    remark: remark.value || [],
    transfer: transfer.value
  };
  console.log("data_refInv : ", data);
  try {
    const response = await Documents.createNewReceiptRefInvoice(data);
    if (response.status) {
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "สร้างใบเสร็จรับเงินแล้ว",
        life: 3000,
      });
    }
    console.log("res_receipt : ", response);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด !",
      detail: "ไม่สามารถสร้างใบเสร็จรับเงินได้",
      life: 3000,
    });
    console.log("error : ", error);
  } finally {
    loading.value = false;
    receiptRefInvoiceDialog.value = false;
    refresh();
  }
}
// -----------------------------

const closeHandle = () => {
  openReceipt.value = false;
  const body = document.body;
  body.style.backgroundColor = "aliceblue";
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["ทั่วไป", "องค์กร", "หน่วยงานราชการ", "VIP"]);

const percents = ref([3, 5]);

const refresh = () => {
  Documents.getReceipts().then((data) => (receipts.value = data.data.reverse()));

  const currentTimestamp = Date.now();
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    new Date(currentTimestamp)
  );
  lastRefreshed.value = formattedTime;
};

const referQuotation = () => {
  if (refQuotation.value && refQuotation.value.customer_detail) {
    console.log("rfQT", refQuotation.value);
    customer.value = customers.value.find(
      (item) => item.customer_name === refQuotation.value.customer_detail.customer_name
    );
    selectedCustomer.value = customer.value;
    selectedCompany.value = cpStore.myCompanies.find(
      (item) =>
        item.Branch_company_name ===
        refQuotation.value.customer_branch.Branch_company_name
    );
    company.value = selectedCompany.value;
    openProductForm.value = true;
    products.value = refQuotation.value.product_detail;
    discount.value = refQuotation.value.discount;
    selectedSignature.value = refQuotation.value.signature;
    bank.value = company.value.bank.find(
      (item) => item.number === refQuotation.value.bank.status
    );
    sumVat.value = refQuotation.value.sumVat;
    console.log("bank", bank.value);
    console.log("company", company.value);
  }
};

const referQuotationInput = () => {
  if (refQuotation.value && !refQuotation.value.customer_detail) {
    refQuotation.value = quotations.value.find(
      (item) => item.quotation === refQuotation.value
    );
    customer.value = customers.value.find(
      (item) => item.customer_name === refQuotation.value.customer_detail.customer_name
    );
    selectedCustomer.value = customer.value;
    selectedCompany.value = cpStore.myCompanies.find(
      (item) =>
        item.Branch_company_name ===
        refQuotation.value.customer_branch.Branch_company_name
    );
    company.value = selectedCompany.value;
    openProductForm.value = true;
    products.value = refQuotation.value.product_detail;
    discount.value = refQuotation.value.discount;
    selectedSignature.value = refQuotation.value.signature;
    bank.value = company.value.bank.find(
      (item) => item.number === refQuotation.value.bank.status
    );
    sumVat.value = refQuotation.value.sumVat;
    console.log("bank", bank.value);
    console.log("company", company.value);
  }
};

const seeReceipt = (data) => {
  openReceipt.value = true;
  selectedReceipt.value = data;
  console.log("data", selectedReceipt.value);
  const body = document.body;
  body.style.backgroundColor = "white";
};

const changeProductVat = () => {
  if (product.value.isVat) {
    product.value.vat_price =
      product.value.product_price * product.value.product_amount * 0.07;
  } else {
    product.value.vat_price = 0;
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
  const [month, day, year] = formattedDate.split("/");
  const formattedThaiDate = `${day}/${month}/${thaiYear}`;

  return formattedThaiDate;
};

const withholdingPrice = computed(() => {
  if (isWithholding.value && sumVat) {
    const result = (netVat.value * withholdingPercent.value) / 100;
    return result;
  } else {
    return 0;
  }
});

const addProduct = () => {
  if (product.value) {
    product.value.product_price = sumVat.value
      ? product.value.product_price
      : product.value.product_price - product.value.vat_price;
    products.value.push(product.value);
    product.value = {};
    product.value.product_text = [""];
    openProductForm.value = false;
  }
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
      const result = pd.product_price * pd.product_amount + pd.vat_price;
      return result;
    });
    const sumPrices = prices.reduce((a, b) => a + b);
    return sumPrices;
  } else {
    return 0;
  }
});

const notSumVatsumProductsPrice = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = sumProductsPrice.value;
    return result;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value) {
    const result = sumProductsPrice.value - vat.value;
    return result;
  } else {
    return 0;
  }
});

const netPrices = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    return sumProductsPrice.value - discount.value;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value) {
    return notSumVatsumProductsPrice.value - discount.value;
  } else {
    return sumProductsPrice.value - discount.value;
  }
});

const vat = computed(() => {
  /* if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = netPrices.value * 0.07;
    return result;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value){
    const result = sumProductsPrice.value * 7/107;
    return result;
  } else {
    return 0;
  } */
  const all_vat = products.value.map((item) => {
    return item.vat_price;
  });
  const result = all_vat.length > 0 ? all_vat.reduce((a, b) => a + b) : 0;
  return result;
});

const netVat = computed(() => {
  if (selectedCompany.value && selectedCompany.value.isVat && sumVat.value) {
    const result = vat.value + netPrices.value;
    return result;
  } else if (selectedCompany.value && selectedCompany.value.isVat && !sumVat.value) {
    const result = netPrices.value + vat.value;
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

  reader.readAsDataURL(blob);

  reader.onloadend = function () {
    const base64data = reader.result;
    product.value.product_logo64 = base64data;
  };

  uploadfiles.value.push(file);
  console.log(uploadfiles.value);
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
  receipt.value = {};
  start_date.value = null;
  end_date.value = null;
  bank.value = {};
  uploadfiles.value = [];
  company.value = {};
  selectedCompany.value = null;
  customer.value = {};
  selectedCustomer.value = null;
  products.value = [];
  product.value = {};
  remark.value = [];
  refQuotation.value = null;
  refInvoice.value = null;
  amount_price.value = null;
};

const openNew = () => {
  resetData();
  submitted.value = false;
  receiptDialog.value = true;
  product.value.product_text = [""];
};

const hideDialog = () => {
  product.value = {};
  products.value = [];
  customer.value = {};
  receiptDialog.value = false;
  receiptEditDialog.value = false;
  receiptRefInvoiceDialog.value = false;
  submitted.value = false;
  resetData();
};

const editReceipt = (prod) => {
  resetData();
  receipt.value = { ...prod };
  console.log("re", receipt.value);

  start_date.value = prod.start_date;
  end_date.value = prod.end_date;

  const company = cpStore.myCompanies.find(
    (item) => item.Branch_company_name === prod.customer_branch.Branch_company_name
  );
  selectedCompany.value = company;

  const customered = customers.value.find(
    (item) => item.customer_taxnumber === prod.customer_detail.tax_id
  );
  selectedCustomer.value = customered;
  refCustomer();

  isWithholding.value = prod.vat.percen_deducted ? true : false;
  withholdingPercent.value = prod.vat.percen_deducted ? prod.vat.percen_deducted : null;
  discount.value = prod.discount;
  products.value = prod.product_detail;
  remark.value = prod.remark;
  bank.value = company
    ? company.bank.find((item) => item.number === prod.bank.status)
    : null;
  selectedSignature.value = cpStore.mySignatures.find(
    (item) => item.name === prod.signature.name
  );
  receiptEditDialog.value = true;
  discount.value = 0;
  product.value = {};
  product.value.product_text = [""];
  sumVat.value = prod.sumVat;
  refQuotation.value = receipt.value.quotation;
  referQuotation();
};

const totalPrice = (product) => {
  const price = product.product_detail.map((item) => {
    return item.product_total - item.vat_price;
  });
  const all_price = price.length > 0 ? price.reduce((a, b) => a + b) : 0;
  return all_price;
};

const totalVat = (product) => {
  const vat = product.product_detail.map((item) => {
    return item.vat_price;
  });
  const result = vat.length > 0 ? vat.reduce((a, b) => a + b) : 0;
  return result;
};

const confirmDeleteReceipt = (prod) => {
  receipt.value = prod;
  deleteReceiptDialog.value = true;
};

const deleteReceipt = async () => {
  const receipts_to_delete = receipt.value;
  try {
    if (receipts_to_delete) {
      console.log(receipts_to_delete._id);
      await Documents.deleteReceipt(receipts_to_delete._id);
      Documents.getReceipts();
      reStore.getReceipts();
      refresh();
      receipt.value = {};
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "ลบใบเสร็จรับเงินแล้ว",
        life: 3000,
      });
    }
  } catch (err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบใบเสร็จรับเงินล้มเหลว",
      life: 3000,
    });
  } finally {
    deleteReceiptDialog.value = false;
  }
};

const withHolding = (product) => {
  const percent = product.vat.percen_deducted;
  const price = totalPrice(product);
  const result = percent > 0 ? (price * percent) / 100 : 0;
  return result;
};

const exportCSV = () => {
  dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
  deleteReceiptsDialog.value = true;
};

const deleteSelectedReceipts = async () => {
  try {
    const receipts_to_delete = receipts.value.filter(
      (val) => !selectedReceipts.value.includes(val)
    );
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
    selectedReceipts.value = null;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "ลบใบเสร็จรับเงินแล้ว",
      life: 3000,
    });
  } catch (err) {
    console.log(err);
  } finally {
    deleteReceiptsDialog.value = false;
    loading.value = false;
    Documents.getReceipts();
    reStore.getReceipts();
    refresh();
  }
};

const createNewReceipt = async () => {
  loading.value = true;
  let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  });
  const data = {
    quotation: refQuotation.value.quotation,
    //invoice: refInvoice.value.invoice,
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
    sumVat: sumVat.value,
  };
  console.log(data);
  try {
    const response = await Documents.createNewReceipt(data);
    if (response.data) {
      img = response.data.product_detail;
      qtId = response.data._id;
      const imgId = img.map((id) => id._id);
      if (imgId.length > 0 && qtId) {
        uploadfiles.value.forEach(async (file, index) => {
          const formData = new FormData();
          formData.append("imgCollection", file);
          const res = await Documents.uploadFileReceipt(imgId[index], qtId, formData);
          reStore.getReceipts();
          refresh();
          receiptDialog.value = false;
          toast.add({
            severity: "success",
            summary: "Successful",
            detail: "สร้างใบเสร็จรับเงินแล้ว",
            life: 3000,
          });
          loading.value = false;
          receiptDialog.value = false;
          refresh();
        });
      } else {
        reStore.getReceipts();
        refresh();
        receiptDialog.value = false;
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "สร้างใบเสร็จรับเงินแล้ว",
          life: 3000,
        });
        loading.value = false;
        refresh();
      }
      refresh();
    } else {
      reStore.getReceipts();
      refresh();
      receiptDialog.value = false;
      toast.add({
        severity: "error",
        summary: "มีบางอย่างผิดพลาด",
        detail: "สร้างใบเสร็จรับเงินล้มเหลว",
        life: 3000,
      });
      receiptDialog.value = false;
      loading.value = false;
      refresh();
    }
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "สร้างใบเสร็จรับเงินแล้ว",
      life: 3000,
    });
    refresh();
  } catch (err) {
    console.log(err);
    receiptDialog.value = false;
    loading.value = false;
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "สร้างใบเสร็จรับเงินล้มเหลว",
      life: 3000,
    });
    refresh();
  }
  receiptDialog.value = false;
  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "สร้างใบเสร็จรับเงินแล้ว",
    life: 3000,
  });
  refresh();
};

const editingReceipt = async () => {
  loading.value = true;
  let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  });
  console.log(refQuotation.value);
  const data = {
    //quotation: refQuotation.value.quotation,
    //invoice: refInvoice.value.invoice,
    customer_number: customer.value.customer_number,
    branchId: selectedCompany.value._id,
    signatureID: selectedSignature.value ? selectedSignature.value._id : "",
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
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    isVat: selectedCompany.value.isVat,
    bank: bank.value
      ? {
          name: bank.value.name,
          remark_2: bank.value.remark,
          status: bank.value.number,
        }
      : {
          name: "",
          remark_2: "",
          status: "",
        },
  };
  console.log(data);
  try {
    const response = await Documents.editReceipt(receipt.value._id, data);
    if (response.data) {
      img = response.data.product_detail;
      qtId = response.data._id;
      const imgId = img.map((id) => id._id);
      if (imgId.length > 0 && qtId) {
        uploadfiles.value.forEach(async (file, index) => {
          const formData = new FormData();
          formData.append("imgCollection", file);
          const res = await Documents.uploadFileReceipt(imgId[index], qtId, formData);
          if (res) {
            reStore.getReceipts().then((data) => (receipts.value = data.data.reverse()));
            receiptDialog.value = false;
            toast.add({
              severity: "success",
              summary: "Successful",
              detail: "แก้ไขใบเสร็จรับเงินแล้ว",
              life: 3000,
            });
            loading.value = false;
          }
        });
      } else {
        reStore.getReceipts();
        refresh();
        receiptEditDialog.value = false;
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "แก้ไขใบเสร็จรับเงินแล้ว",
          life: 3000,
        });
        loading.value = false;
      }
    } else {
      receiptEditDialog.value = false;
      toast.add({
        severity: "error",
        summary: "มีบางอย่างผิดพลาด",
        detail: "แก้ไขใบเสร็จรับเงินล้มเหลว",
        life: 3000,
      });
      loading.value = false;
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
    receiptEditDialog.value = false;
    refresh();
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
