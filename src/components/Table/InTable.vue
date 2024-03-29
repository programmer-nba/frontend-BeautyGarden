<template>
  <div class="h-full">
    <Toast />
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openInvoice"
    >
      <DocInvoice
        :color="color"
        :data="selectedInvoice"
        :header="inputHeader"
        :isSign="sign"
        @close="closeHandle"
      />
    </div>
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openInvoiceII"
    >
      <DocInvoiceII
        :color="color"
        :data="selectedInvoice"
        :header="inputHeader"
        :isSign="sign"
        @close="closeHandle"
      />
    </div>

    <div v-if="!openInvoice && !openInvoiceII" class="card">
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
            :disabled="!selectedInvoices || !selectedInvoices.length"
          />
          <Button icon="pi pi-refresh" @click="refresh" />
          <small class="opacity-60">{{ lastRefreshed }}</small>
        </template>

        <template #end>
          <Button
            label="ดาวน์โหลดไฟล์"
            icon="pi pi-upload"
            class="mr-4 py-3"
            severity="help"
            @click="exportCSV($event)"
          />
            เปลี่ยนสี 
          <ColorPicker class="px-3" v-model="color" />
          {{ color }}
        </template>
      </Toolbar>

      <DataTable
        ref="dt"
        :value="invoices"
        v-model:selection="selectedInvoices"
        dataKey="_id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
        :pt="{
          header: { style: `backgroundColor: #${color}` },
        }"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <div class="flex items-center gap-3">
              <p class="m-0">
                จัดการเอกสาร
              </p>
              <SelectButton v-model="curfilter" :options="['ทั้งหมด', 'ยังไม่ครบ', 'ครบแล้ว']" aria-labelledby="basic" @change="filterInvoice(curfilter)" />
            </div>
            
            <span class="p-input-icon-right border rounded">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" class="px-3" placeholder="ค้นหา..." />
            </span>
            <div class="flex gap-3 self-end items-center bg-slate-300 px-3 py-1 rounded">
              <Checkbox v-model="sign" :binary="true" />
              <p>ลายเซ็นอิเล็กทรอนิกส์</p>
            </div>
          </div>
        </template>

        <template #empty>
          <div class="w-full flex justify-center items-center py-48 border-t border-b">
            <p class="tex-lg">ไม่มีข้อมูล</p>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column
          field="invoice"
          header="เลขที่"
          sortable
          style="min-width: 12rem"
          class="border-b"
        >
        <template #body="slotProps">
          <span class="text-xs">
            {{ slotProps.data.invoice }}
            <i 
              @click="onCoppy(slotProps.data.invoice)" 
              class="pi text-xs pi-file-export cursor-pointer hover:text-sky-500 hover:bg-sky-100 duration-300 ease-in-out p-2 rounded-full" 
              v-tooltip.top="'ใช้อ้างอิงใบเสร็จ'"
              >
            </i>
          </span>
        </template>
        </Column>
        <Column
          field="customer_detail.customer_name"
          header="ชื่อลูกค้า"
          sortable
          style="min-width: 14rem"
          class="border-b text-sm"
        ></Column>
        <Column
          field="start_date"
          header="วันที่เริ่ม"
          class="border-b"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <p class="text-sm">{{ formatThaiDate(slotProps.data.start_date) }}</p>
          </template>
        </Column>
        <Column
          field="end_date"
          header="วันครบกำหนด"
          class="border-b"
          sortable
          style="min-width: 10rem"
        >
          <template #body="slotProps">
            <p class="text-sm">{{ formatThaiDate(slotProps.data.end_date) }}</p>
          </template>
        </Column>
        <Column
          field="end_date"
          header="เวลาคงเหลือ"
          class="border-b text-sm"
          sortable
          style="min-width: 9rem"
        >
          <template #body="slotProps">
            <span 
              v-if="slotProps.data.cur_period!==slotProps.data.end_period"
              :class="
              countdownToEndDate(slotProps.data.end_date).days > 0 ? 'font-bold' 
              : countdownToEndDate(slotProps.data.end_date).days === 0  ? 'text-green-700 font-bold'
              : 'text-red-700 font-bold'
            ">
            {{ 
              countdownToEndDate(slotProps.data.end_date).days > 0
              ? countdownToEndDate(slotProps.data.end_date).days + ' วัน'
              : countdownToEndDate(slotProps.data.end_date).days === 0 ? 'วันนี้'
              : 'เกินกำหนด ' + countdownToEndDate(slotProps.data.end_date).days*(-1) + ' วัน'
            }}
            </span>
            <span 
              class="font-bold text-green-700"
              v-else
            >
              เสร็จสมบูรณ์
            </span>
          </template>
        </Column>

        <Column
          field="total"
          class="border-b text-sm"
          header="จำนวนเต็ม"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            {{ 
              slotProps.data.customer_branch?.isVat && slotProps.data.sumVat
              ? formatCurrency(totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) + (slotProps.data.project?.total || 0) + (slotProps.data.project?.vat_price || 0)) 
              : slotProps.data.customer_branch?.isVat && !slotProps.data.sumVat
              ? formatCurrency(totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) + (slotProps.data.project?.total || 0)) 
              : formatCurrency(slotProps.data.total - slotProps.data.discount + (slotProps.data.project?.total || 0)) 
            }}
          </template>
        </Column>
        <Column
          field="total"
          class="border-b text-sm"
          header="คงค้าง"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <pre class="hidden">
              {{ slotProps.data.project.vat_price = slotProps.data.isVat ? slotProps.data.project?.vat_price : 0 }}</pre>
            <span
              :class="
              totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) - (slotProps.data.paid || 0) <= 0
              ? 'text-green-700 font-bold bg-green-100 rounded px-2 py-0.5'
              : ''
              "
            >
            {{ 
              slotProps.data.invoice && totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) + totalVat(slotProps.data) + (slotProps.data.project?.total || 0) + (slotProps.data.project?.vat_price || 0) - (slotProps.data.paid || 0) <= 0
              ? 'ครบแล้ว'
              : formatCurrency(totalPrice(slotProps.data) - slotProps.data.discount + totalVat(slotProps.data) - (slotProps.data.paid || 0) + (slotProps.data.project?.total || 0) + (slotProps.data.project?.vat_price || 0)) 
            }}</span>
            
          </template>
        </Column>
        
        <Column
          field="status[0]"
          header="สถานะ"
          sortable
          style="min-width: 6rem"
          class="border-b text-xs"
        >
          <template #body="slotProps">
            งวด {{ slotProps.data.cur_period }} / {{ slotProps.data.end_period }}
            <i @click="openNextInvoice(slotProps.data)" v-tooltip.top="`สร้างใบแจ้งหนี้งวด ${slotProps.data.cur_period+1}`" v-show="slotProps.data.cur_period > 0 && slotProps.data.invoice_period.length+1 < slotProps.data.end_period && slotProps.data.cur_period !== slotProps.data.end_period" class="pi hover:text-sky-800 cursor-pointer pi-plus-circle pl-2 text-sky-500"></i>
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 13rem" class="border-b">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-1 justify-center items-center">
              <Button 
                class="text-green-600 hover:bg-green-100" 
                v-tooltip.top="'ดูใบเสร็จ'"
                icon="pi pi-dollar" 
                outlined 
                rounded
                @click="openRefReceipt(slotProps.data)" />
              <div class="relative">
                <Button
                  v-if="slotProps.data.status.length > 0 && slotProps.data.end_period > 1"
                  class="text-blue-600 hover:bg-blue-100 focus:bg-blue-100" 
                  v-tooltip.top="'ปริ้นท์'"
                  icon="pi pi-file" 
                  outlined 
                  rounded
                  @click="openMenus=slotProps.data._id"
                  @blur="blurMenu(slotProps.data._id)"
                />
                <Button
                  v-else
                  class="text-blue-600 hover:bg-blue-100" 
                  v-tooltip.top="'ปริ้นท์'"
                  icon="pi pi-file" 
                  outlined 
                  rounded
                  @click="seeInvoice(slotProps.data)" 
                  
                />
                <div v-show="openMenus===slotProps.data._id" class="absolute -top-12 bg-black text-white z-10 shadow-lg flex flex-col divide-y-2 w-[100px] overflow-x-hidden">
                  <p v-for="i in slotProps.data.end_period" :key="i" class="py-1 px-2 cursor-pointer hover:bg-white hover:text-black duration-300 ease-in-out"
                  @click="seeInvoiceRef(slotProps.data, i)"
                  @mouseover="hoverMenu=true"
                  @mouseout="hoverMenu=false"
                  >งวดที่ {{ i }}</p>
                </div>
              </div>
              <Button
                class="text-yellow-600 hover:bg-orange-100"
                v-tooltip.top="'แก้ไข'"
                icon="pi pi-pencil"
                outlined
                rounded
                @click="editInvoice(slotProps.data)"
              />
              <Button
                class="text-red-600 hover:bg-red-100"
                v-tooltip.top="'ลบ'"
                icon="pi pi-trash"
                outlined
                rounded
                @click="confirmDeleteInvoice(slotProps.data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="invoiceDialog"
      :style="{ width: '450px' }"
      header="ใบแจ้งหนี้ INVOICE"
      :modal="true"
      class="p-fluid"
    >
    <div class="card flex flex-col gap-y-2 justify-content-center border-b py-4">
      <p class="font-bold">อ้างอิงใบเสนอราคา</p>
      <Dropdown
        v-model="refQuotation"
        editable
        :options="quotations"
        optionLabel="quotation"
        placeholder="เลือกใบเสนอราคา"
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
      <div class="flex flex-col items-center justify-center mt-3">
        <p class="text-xl font-semibold">หัวเอกสาร</p>
        <InputText class="py-2 px-2 text-center bg-sky-100 text-xl" v-model="inputHeader" />
      </div>
      <div class="card pt-5">
        <div class="card flex gap-2 justify-start items-center">
          <p>วันที่เริ่มต้น</p>
          <Calendar class="border rounded" v-model="start_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card flex gap-2 justify-start items-center pt-3">
          <p>วันครบกำหนด</p>
          <Calendar class="border rounded" v-model="end_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card py-2 justify-start items-center">
          <p class="min-w-fit" for="credit">เครดิต <span class="px-2 text-bold text-green-700">{{ credit }}</span>วัน</p>
        </div>
        <div class="card py-2 flex gap-2 justify-start items-center pb-5">
          <p class="min-w-fit" for="credit">จำนวนงวดชำระ</p>
          <input type="number" min="1" v-model="end_period" class="border rounded max-w-[4rem] text-center" />
        </div>
        <div class="pt-2 border-t">
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
            <p class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            <div>
              <p class="pb-2">ช่องทางการชำระเงิน</p>
              <div class="card flex justify-center bg-slate-200 rounded py-2">
                <div class="flex flex-wrap gap-3">
                    <div class="flex items-center">
                        <RadioButton v-model="transfer" inputId="cash" name="cash" value="cash" />
                        <label for="cash" class="ml-2">เงินสด</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton v-model="transfer" inputId="bank" name="bank" value="bank" />
                        <label for="bank" class="ml-2">เงินโอน</label>
                    </div>
                </div>
              </div>
              <div class="pt-2" v-if="transfer==='bank'">
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
              >{{ customer?.customer_name }}
              {{ customer?.customer_lastname ? `(${customer?.customer_lastname})` : "" }}
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
            :class="{ 'p-invalid': !customer?.customer_name }"
          />
          <small class="p-error" v-if="!customer?.customer_name"
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
            :class="{ 'p-invalid': !customer.customer_number }"
          />
          <small class="p-error" v-if="!customer.customer_number"
            >กรุณาเพิ่มรหัสลูกค้า</small
          >
        </div>

        <div class="field">
          <label for="customer_taxnumber">เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน</label>
          <InputText
            class="p-2"
            id="customer_taxnumber"
            v-model.trim="customer.customer_taxnumber"
            required="false"
          />
        </div>
        <div class="field">
          <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_phone"
            v-model.trim="customer.customer_phone"
            required="false"
            :class="{ 'p-invalid': !customer.customer_phone }"
          />
          <small class="p-error" v-if="!customer.customer_phone"
            >กรุณาเพิ่มเบอร์ติดต่อลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_lastname">สำนักงานใหญ่/สาขา</label>
          <InputText
            class="p-2"
            id="customer_lastname"
            v-model.trim="customer.customer_lastname"
            required="false"
          />
        </div>
        <div class="field">
          <label for="customer_position">ที่อยู่ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_position"
            v-model.trim="customer.customer_position"
            required="true"
            :class="{ 'p-invalid': !customer.customer_position }"
          />
          <small class="p-error" v-if="!customer.customer_position"
            >กรุณาเพิ่มที่อยู่ลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_email">อีเมล์ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_email"
            v-model.trim="customer.customer_email"
            required="false"
            :class="{ 'p-invalid': !customer.customer_email }"
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

          <div class="flex py-3 align-items-center">
            <Checkbox
              v-model="isWithholding"
              inputId="ingredient1"
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
            :class="{ 'p-invalid': !customer.customer_contact }"
          />
        </div>
        <div class="field">
          <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            required="false"
            :class="{ 'p-invalid': !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />

      <!-- <span class="my-2" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? 'Vat ใน' : 'Vat นอก' }}</span>
      </span> -->

      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="prod.project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="prod.project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>

      <!-- <div class="py-4 px-2 bg-slate-100 rounded">
        <label for="product_head" class="font-semibold text-lg">หัวข้อหลัก</label>
        <InputText id="product_head" v-model="product_head" />
      </div> -->

      <!-- <div class="card">
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
                          {{ formatCurrency(item.product_price+(item.vat_price || 0)) }} x
                          {{ item.product_amount }} {{ item.unit }}
                          {{
                            item.vat_price && item.vat_price>0 && sumVat ? ' (' + 'VATนอก' + ')' 
                            : item.vat_price && item.vat_price>0 && !sumVat ? ' (' + 'VATใน' + ')' 
                            : null 
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex flex-column md:align-items-end gap-5">
                      <span class="text-xl font-semibold text-900"
                        >{{
                          formatCurrency((item.product_amount * item.product_price) + ((item.vat_price || 0)*item.product_amount))
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
      </div> -->
      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <inputText v-model="prod.project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <inputNumber v-model="prod.project.amount" />
                <inputText v-model="prod.project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <inputNumber v-model="prod.project.price" />
            </div>
            <pre class="hidden">
              {{ 
                prod.project.isVat && sumVat
                ? prod.project.vat_price = prod.project.total*0.07
                : prod.project.isVat && !sumVat
                ? prod.project.vat_price = prod.project.total*7/107
                : 0
              }}
            </pre>

            <div class="py-3" v-if="sumVat">
              <p>ราคาสินค้า/บริการ</p>
              <pre class="hidden">{{ prod.project.total = (prod.project.price * prod.project.amount) || 0 }}</pre>
              <inputNumber v-model="prod.project.total" />
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0 && !sumVat">
              <p>ราคาสินค้า/บริการ</p> 
              <p class="">{{ formatCurrency(prod.project.total-prod.project.vat_price) }}</p>
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project?.vat_price!==0">
              <p>VAT 7%</p> 
              <p class="">{{ formatCurrency(prod.project.vat_price) }}</p>
            </div>
            
            <div class="py-3" v-if="!sumVat">
              <p>ราคาสินค้า/บริการ 
                <span class="px-2 text-sm bg-yellow-300">
                  {{ 'รวม Vat' }}
                </span>
              </p>
              <pre class="hidden">{{ prod.project.total = (prod.project.price * prod.project.amount) || 0 }}</pre>
              <inputNumber v-model="prod.project.total" />
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0 && sumVat">
              <p>ราคาสินค้า/บริการ<span class="px-2 text-sm bg-yellow-300">
                {{ 'รวม Vat' }}
              </span></p> 
              <p class="">{{ formatCurrency(prod.project.total+prod.project.vat_price) }}</p>
            </div>

          </div>
        </div>
        <DataView :value="products">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex justify-between flex-column sm:flex-row sm:items-center p-4 gap-3 border-b"
                  :class="{ 'surface-border': index !== 0 }"
                >
                  <div class="overflow-x-auto w-[120px]">
                    <div v-if="item.product_logo?.length > 0" class="flex border overflow-x-auto">
                      <div v-for="(pic, picindex) in item.product_logo" :key="picindex" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="pic"
                          :alt="picindex"
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
                          <span class="text-orange-500" :class="item.product_name ? 'font-bold bg-orange-200 px-5' : ''">{{ item.product_name ? item.product_no : item.product_no+'.'+item.product_text_no }}</span> 
                          {{ item.product_name || null }}
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
                          {{ formatCurrency(item.product_price+(item.vat_price || 0)) }} x
                          {{ item.product_amount }} {{ item.unit }}
                          {{
                            item.vat_price && item.vat_price>0 && sumVat ? ' (' + 'VAT นอก' + ')' 
                            : item.vat_price && item.vat_price>0 && !sumVat ? ' (' + 'VAT ใน' + ')' 
                            : null 
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center md:items-end gap-5">
                      <span v-if="item.product_price > 0" class="font-semibold text-900"
                        >
                        {{
                          formatCurrency((item.product_price+(item.vat_price || 0)) * item.product_amount)
                        }}.-</span
                      >
                      <div class="flex flex-col h-fit">
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
                  
                  <div v-if="product?.product_logo?.length>0" class="card flex flex-col justify-center">
                    <div class="flex gap-2 w-full pr-5 justify-between h-[100px] items-center" v-for="(pic, picindex) in product?.product_logo" :key="picindex">
                      <Image :src="pic" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo.splice(picindex, 1)" class="pi pi-times" style="color: red"></i>
                  </div>
                  </div>
                </template>
            </FileUpload>
          </div>
        </div>

        <!--sub details-->
        <div>
          <div class="field">
            <div class="flex gap-2 items-center">
              <label class="font-semibold text-lg">หัวข้อที่</label>
              <input type="text" v-model="product.product_no" class="border-b text-center rounded w-20" />
            </div>
            
            <div class="card flex justify-content-center">
              <InputText class="px-2 py-2" v-model="product.product_name" />
            </div>
            
            <div class="flex gap-2 items-center">
              <label class="font-semibold py-3 text-lg">รายละเอียดที่ <span>{{ product.product_no }}.</span></label>
              <input type="text" v-model="product.product_text_no" class="border-b text-center rounded w-10" min="1" />
            </div>
            
            <div
              v-for="(text, textInputIndex) in product.product_text"
              class="card flex flex-col gap-y-5 items-center justify-center"
            >
              <Textarea
                v-model="product.product_text[textInputIndex]"
                autoResize
                placeholder="รายละเอียด..."
                rows="5"
                cols="50"
                class="border-2 mb-2"
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
          <pre class="hidden">{{ !isPrice ? product.product_price = 0 : product.product_price = product.product_price }}</pre>
          <div class="field grid w-full px-5">
            <div class="field grid">
              <div class="flex items-center mt-3 gap-2">
                <label for="quantity">รายละเอียดราคา</label>
                <InputSwitch v-model="isPrice" />
              </div>
              <InputNumber
                class="p-2 w-full"
                id="price"
                v-model="product.product_price"
                mode="currency"
                currency="THB"
                :disabled="!isPrice"
              />
            </div>
            <pre class="hidden">{{ !isAmount ? product.product_amount = 0 : product.product_price = product.product_price }}</pre>
            <div class="field grid">
              <div class="flex items-center mt-3 gap-2">
                <label for="quantity">จำนวน</label>
                <InputSwitch v-model="isAmount" />
              </div>
              <InputNumber
                class="p-2"
                id="quantity"
                v-model="product.product_amount"
                integeronly
                :disabled="!isAmount"
              />
            </div>
            <div class="field grid">
              <label for="unit">หน่วย</label>
              <InputText
                class="px-2"
                id="unit"
                v-model="product.unit"
                :disabled="!isAmount"
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
                  ? formatCurrency((product.product_amount * product.product_price)+((product.vat_price || 0)*product.product_amount)) 
                  : formatCurrency((product.product_amount * product.product_price)-((product.vat_price || 0)*product.product_amount)) 
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

        <div v-if="prod.project.isVat && !sumVat">
          <p>ราคารวม
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+vat+(prod.project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="prod.project.isVat && sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="prod.project.isVat && !sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0)-prod.project.vat_price) || 0
            }}</span>
          </p>
        </div>

        <div v-if="!prod.project.isVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0))
            }}</span>
          </p>
        </div>
        
        <p>
          ส่วนลด
          <span class="border-b px-2">
            {{ formatCurrency(discount) || 0 }}
          </span>
        </p>
        <p>
          ราคาหลังหักส่วนลด
          <span class="border-b px-2">
            {{ formatCurrency(netPrices) || 0 }}
          </span>
        </p>
        <p v-if="prod.project.isVat || selectedCompany?.isVat">
          VAT 7% 
          <span class="border-b px-2">
            {{ formatCurrency(vat+(prod.project.vat_price || 0)) || 0 }}
          </span>
        </p>
        <pre class="hidden">
          {{
            prod.project.total_net = prod.project.isVat && sumVat ? prod.project.total + prod.project.vat_price : prod.project.isVat && !sumVat ? prod.project.total
            : 0
          }}
        </pre>
        <p v-if="prod.project.isVat || selectedCompany?.isVat">
          ราคารวม VAT
          <span class="border-b px-2">{{ formatCurrency(netVat) || 0 }}</span>
        </p>
        <span v-if="isWithholding">
          หัก ณ ที่จ่าย {{ withholdingPercent }}%
            <p class="border-b px-2">
              {{
                formatCurrency(withholdingPrice) || 0
              }}
            </p>
          </span>
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
          @click="createNewInvoice"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="invoiceEditDialog"
      :style="{ width: '450px' }"
      header="แก้ไขใบแจ้งหนี้"
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
      <div class="flex flex-col items-center justify-center mt-3">
        <p class="text-xl font-semibold">หัวเอกสาร</p>
        <InputText class="py-2 px-2 text-center bg-sky-100 text-xl" v-model="inputHeader" />
      </div>
      <div class="card pt-5">
        <div class="card flex flex-col gap-y-2 justify-center items-center">
          <p>วันที่เริ่มต้น</p>
          <Calendar class="border" v-model="start_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card flex gap-2 justify-start items-center pt-3">
          <p>วันครบกำหนด</p>
          <Calendar class="border rounded" v-model="end_date" showButtonBar dateFormat="dd/mm/yy" />
        </div>
        <div class="card py-2 justify-start items-center">
          <p class="min-w-fit" for="credit">เครดิต <span class="px-2 text-bold text-green-700">{{ credit }}</span>วัน</p>
        </div>
        <div class="card py-2 flex gap-2 justify-start items-center pb-5">
          <p class="min-w-fit" for="credit">จำนวนงวดชำระ</p>
          <input type="number" min="1" v-model="end_period" class="border rounded max-w-[4rem] text-center" />
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
            <p class="m-0">เลขประจำตัวผู้เสียภาษี : {{ selectedCompany?.taxnumber }}</p>
            <p class="m-0">โทร : {{ selectedCompany?.Branch_company_number }}</p>
            <p class="m-0">อีเมล์ : {{ selectedCompany?.company_email }}</p>
            <p class="m-0">ผู้ติดต่อ : {{ selectedCompany?.contact_name }}</p>
            <p class="m-0">เบอร์ผู้ติดต่อ : {{ selectedCompany?.contact_number }}</p>
            <br />
            <div>
              <p class="pb-2">ช่องทางการชำระเงิน</p>
              <div class="card flex justify-center bg-slate-200 rounded py-2">
                <div class="flex flex-wrap gap-3">
                    <div class="flex items-center">
                        <RadioButton v-model="transfer" inputId="cash" name="cash" value="cash" />
                        <label for="cash" class="ml-2">เงินสด</label>
                    </div>
                    <div class="flex items-center">
                        <RadioButton v-model="transfer" inputId="bank" name="bank" value="bank" />
                        <label for="bank" class="ml-2">เงินโอน</label>
                    </div>
                </div>
              </div>
              <div v-if="transfer==='bank'" class="pt-2">
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
            :class="{ 'p-invalid': !customer.customer_name }"
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
            :class="{ 'p-invalid': !customer.customer_number }"
          />
          <small class="p-error" v-if="!customer.customer_number"
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
          />
        </div>
        <div class="field">
          <label for="customer_phone">เบอร์ติดต่อลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_phone"
            v-model.trim="customer.customer_phone"
            required="false"
            :class="{ 'p-invalid': !customer.customer_phone }"
          />
          <small class="p-error" v-if="!customer.customer_phone"
            >กรุณาเพิ่มเบอร์ติดต่อลูกค้า</small
          >
        </div>
        <div class="field">
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
            required="true"
            :class="[{ 'p-invalid': !customer.customer_position }, { 'p-invalid': !customer.customer_position }]"
          />
          <small class="p-error" v-if="!customer.customer_position"
            >กรุณาเพิ่มที่อยู่ลูกค้า</small
          >
        </div>
        <div class="field">
          <label for="customer_email">อีเมล์ลูกค้า</label>
          <InputText
            class="p-2"
            id="customer_email"
            v-model.trim="customer.customer_email"
            required="false"
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
            :class="{ 'p-invalid': !customer.customer_contact }"
          />
        </div>
        <div class="field">
          <label for="customer_contact_number">เบอร์ผู้ติดต่อ</label>
          <InputText
            class="p-2"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            required="false"
            :class="{ 'p-invalid': !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />

      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="prod.project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="prod.project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>

      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <inputText v-model="prod.project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <inputNumber v-model="prod.project.amount" />
                <inputText v-model="prod.project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <inputNumber v-model="prod.project.price" />
            </div>
            <pre class="hidden">
              {{ 
                prod.project.isVat && sumVat
                ? prod.project.vat_price = prod.project.total*0.07
                : prod.project.isVat && !sumVat
                ? prod.project.vat_price = prod.project.total*7/107
                : 0
              }}
            </pre>

            <div class="py-3" v-if="sumVat">
              <p>ราคาสินค้า/บริการ</p>
              <pre class="hidden">{{ prod.project.total = (prod.project.price * prod.project.amount) || 0 }}</pre>
              <inputNumber v-model="prod.project.total" />
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0 && !sumVat">
              <p>ราคาสินค้า/บริการ</p> 
              <p class="">{{ formatCurrency(prod.project.total-prod.project.vat_price) }}</p>
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project?.vat_price!==0">
              <p>VAT 7%</p> 
              <p class="">{{ formatCurrency(prod.project.vat_price) }}</p>
            </div>
            
            <div class="py-3" v-if="!sumVat">
              <p>ราคาสินค้า/บริการ 
                <span class="px-2 text-sm bg-yellow-300">
                  {{ 'รวม Vat' }}
                </span>
              </p>
              <pre class="hidden">{{ prod.project.total = (prod.project.price * prod.project.amount) || 0 }}</pre>
              <inputNumber v-model="prod.project.total" />
            </div>

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0 && sumVat">
              <p>ราคาสินค้า/บริการ<span class="px-2 text-sm bg-yellow-300">
                {{ 'รวม Vat' }}
              </span></p> 
              <p class="">{{ formatCurrency(prod.project.total+prod.project.vat_price) }}</p>
            </div>

          </div>
        </div>
        <DataView :value="products">
          <template #list="slotProps">
            <div class="grid grid-nogutter">
              <div v-for="(item, index) in slotProps.items" :key="index">
                <div
                  class="flex justify-between flex-column sm:flex-row sm:items-center p-4 gap-3 border-b"
                  :class="{ 'surface-border': index !== 0 }"
                >
                  <div class="overflow-x-auto w-[120px]">
                    <div v-if="item.product_logo?.length > 0" class="flex border overflow-x-auto">
                      <div v-for="(pic, picindex) in item.product_logo" :key="picindex" class="h-[100px] w-full">
                        <img
                          class="w-full h-full object-cover"
                          :src="pic"
                          :alt="picindex"
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
                          <span class="text-orange-500" :class="item.product_name ? 'font-bold bg-orange-200 px-5' : ''">{{ item.product_name ? item.product_no : item.product_no+'.'+item.product_text_no }}</span> 
                          {{ item.product_name || null }}
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
                          {{ formatCurrency(item.product_price+(item.vat_price || 0)) }} x
                          {{ item.product_amount }} {{ item.unit }}
                          {{
                            item.vat_price && item.vat_price>0 && sumVat ? ' (' + 'VAT นอก' + ')' 
                            : item.vat_price && item.vat_price>0 && !sumVat ? ' (' + 'VAT ใน' + ')' 
                            : null 
                          }}
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center md:items-end gap-5">
                      <span v-if="item.product_price > 0" class="font-semibold text-900"
                        >
                        {{
                          formatCurrency((item.product_price+(item.vat_price || 0)) * item.product_amount)
                        }}.-</span
                      >
                      <div class="flex flex-col h-fit">
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
                  
                  <div v-if="product?.product_logo?.length>0" class="card flex flex-col justify-center">
                    <div class="flex gap-2 w-full pr-5 justify-between h-[100px] items-center" v-for="(pic, picindex) in product?.product_logo" :key="picindex">
                      <Image :src="pic" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo.splice(picindex, 1)" class="pi pi-times" style="color: red"></i>
                  </div>
                  </div>
                </template>
            </FileUpload>
          </div>
        </div>

        <!--sub details-->
        <div>
          <div class="field">
            <div class="flex gap-2 items-center">
              <label class="font-semibold text-lg">หัวข้อที่</label>
              <input type="text" v-model="product.product_no" class="border-b text-center rounded w-20" />
            </div>
            
            <div class="card flex justify-content-center">
              <InputText class="px-2 py-2" v-model="product.product_name" />
            </div>
            
            <div class="flex gap-2 items-center">
              <label class="font-semibold py-3 text-lg">รายละเอียดที่ <span>{{ product.product_no }}.</span></label>
              <input type="text" v-model="product.product_text_no" class="border-b text-center rounded w-10" min="1" />
            </div>
            
            <div
              v-for="(text, textInputIndex) in product.product_text"
              class="card flex flex-col gap-y-5 items-center justify-center"
            >
              <Textarea
                v-model="product.product_text[textInputIndex]"
                autoResize
                placeholder="รายละเอียด..."
                rows="5"
                cols="50"
                class="border-2 mb-2"
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
          <pre class="hidden">{{ !isPrice ? product.product_price = 0 : product.product_price = product.product_price }}</pre>
          <div class="field grid w-full px-5">
            <div class="field grid">
              <div class="flex items-center mt-3 gap-2">
                <label for="quantity">รายละเอียดราคา</label>
                <InputSwitch v-model="isPrice" />
              </div>
              <InputNumber
                class="p-2 w-full"
                id="price"
                v-model="product.product_price"
                mode="currency"
                currency="THB"
                :disabled="!isPrice"
              />
            </div>
            <pre class="hidden">{{ !isAmount ? product.product_amount = 0 : product.product_price = product.product_price }}</pre>
            <div class="field grid">
              <div class="flex items-center mt-3 gap-2">
                <label for="quantity">จำนวน</label>
                <InputSwitch v-model="isAmount" />
              </div>
              <InputNumber
                class="p-2"
                id="quantity"
                v-model="product.product_amount"
                integeronly
                :disabled="!isAmount"
              />
            </div>
            <div class="field grid">
              <label for="unit">หน่วย</label>
              <InputText
                class="px-2"
                id="unit"
                v-model="product.unit"
                :disabled="!isAmount"
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
                  ? formatCurrency((product.product_amount * product.product_price)+((product.vat_price || 0)*product.product_amount)) 
                  : formatCurrency((product.product_amount * product.product_price)-((product.vat_price || 0)*product.product_amount)) 
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

        <div v-if="prod.project.isVat && !sumVat">
          <p>ราคารวม
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+vat+(prod.project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="prod.project.isVat && sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="prod.project.isVat && !sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0)-prod.project.vat_price) || 0
            }}</span>
          </p>
        </div>

        <div v-if="!prod.project.isVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(prod.project.total || 0))
            }}</span>
          </p>
        </div>
        
        <p>
          ส่วนลด
          <span class="border-b px-2">
            {{ formatCurrency(discount) || 0 }}
          </span>
        </p>
        <p>
          ราคาหลังหักส่วนลด
          <span class="border-b px-2">
            {{ formatCurrency(netPrices) || 0 }}
          </span>
        </p>
        <p v-if="prod.project.isVat || selectedCompany?.isVat">
          VAT 7% 
          <span class="border-b px-2">
            {{ formatCurrency(vat+(prod.project.vat_price || 0)) || 0 }}
          </span>
        </p>
        <pre class="hidden">
          {{
            prod.project.total_net = prod.project.isVat && sumVat ? prod.project.total + prod.project.vat_price : prod.project.isVat && !sumVat ? prod.project.total
            : 0
          }}
        </pre>
        <p v-if="prod.project.isVat || selectedCompany?.isVat">
          ราคารวม VAT
          <span class="border-b px-2">{{ formatCurrency(netVat) || 0 }}</span>
        </p>
        <span v-if="isWithholding">
          หัก ณ ที่จ่าย {{ withholdingPercent }}%
            <p class="border-b px-2">
              {{
                formatCurrency(withholdingPrice) || 0
              }}
            </p>
          </span>
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
          @click="editingInvoice"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteInvoiceDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="invoice"
          >คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?<b>{{ invoice.invoice }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          class="py-3"
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteInvoiceDialog = false"
        />
        <Button
          class="py-3"
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteInvoice"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteInvoicesDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="invoice">คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?</span>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteInvoicesDialog = false"
        />
        <Button
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteSelectedInvoices"
        />
      </template>
    </Dialog>

    <RefReceipt 
      v-if="openRefReceiptDialog" 
      :invoice="selected_invoice" 
      @open_close="val=>openRefReceiptDialog=val" 
    />

  </div>

  <Dialog v-model:visible="openNextInvoiceDialog" modal :header="`${selectedInvoice.invoice}-${selectedInvoice.cur_period+1}/${selectedInvoice.end_period}`" :style="{ width: '25rem' }">
    <div class="flex flex-col gap-5">
      <div class="flex flex-col gap-3">
        <p>วันที่ออกเอกสาร</p>
        <Calendar v-model="nextInvoice.start_date" class="border" />
      </div>
      <div class="flex flex-col gap-3">
        <p>วันที่สิ้นสุด</p>
        <Calendar v-model="nextInvoice.end_date" class="border" />
      </div>
    </div>
    <Button class="px-2 py-1 bg-orange-400 w-full text-center text-white my-5" label="บันทึก" @click="createNextInvoice" />
  </Dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { Documents } from "@/service/ProductService";
import { Customers } from "@/service/Customer";
import { useInvoiceStore } from "@/stores/invoice";
import { useCompanyStore } from "@/stores/company";
import DocInvoice from "@/components/Pdf/DocInvoice.vue";
import DocInvoiceII from "@/components/Pdf/DocInvoiceII.vue";
import RefReceipt from '@/components/Dialog/RefReceipt.vue';
import { formatThaiDate } from '@/functions/DateTime'
import { copyToClipboard } from "@/functions/Coppy"
import axios from "axios"

onMounted(async () => {
  Documents.getInvoices().then((data) => {
    originalInvoices.value = data.data.reverse()
    invoices.value = originalInvoices.value
  });
  Documents.getQuotations().then((data) => (quotations.value = data.data));
  Customers.getCustomers().then((data) => (customers.value = data.data));
  await cpStore.getMyCompanies();
  await cpStore.getMySignatures();
})

const originalInvoices = ref([])
const quotations = ref([])
const lastRefreshed = ref();
const openInvoice = ref(false);
const openInvoiceII = ref(false);
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
const invoices = ref();
const invoiceDialog = ref(false);
const deleteInvoiceDialog = ref(false);
const deleteInvoicesDialog = ref(false);
const invoice = ref({});
const selectedInvoices = ref();
const selectedInvoice = ref({});
const uploadfiles = ref([]);
const invoiceEditDialog = ref(false);
const color = ref();
const bank = ref({});
const refQuotation = ref()
const end_period = ref(1)
const cur_period = ref(0)
const product_head = ref('')
const edittingProduct = ref()
const files = ref([])
const transfer = ref('bank')
const inputHeader = ref('ใบแจ้งหนี้')
const sign = ref(false)
const isAmount = ref(true);
const prod = ref({
  project: {},
  product_detail: []
});

const choosesumVat = ref('Vat นอก');
const changesumVat = () => {
  if (prod.value.project.isVat && choosesumVat.value === 'Vat นอก') {
    sumVat.value = true
  } else {
    sumVat.value = false
  }
};

watch(() => prod.value.project.isVat, (newValue, oldValue) => {
  if(!newValue) {
    prod.value.project.vat_price = 0
  }
})

const reStore = useInvoiceStore()
const cpStore = useCompanyStore()

const emits = defineEmits(["chooseRef", "refIv"])
const onCoppy = (value) => {
  console.log(value)
  emits("chooseRef")
  emits("refIv", value)
}

// open reference receipts list
const selected_invoice = ref()
const openRefReceiptDialog = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const submitted = ref(false);
const statuses = ref(["Normal", "องค์กร", "หน่วยงานราชการ", "ลูกค้ารายเดือน", "VIP"]);
const percents = ref([3, 5]);

function countdownToEndDate(end_date) {
  // Convert the end date to a Date object
  const endDate = new Date(end_date);

  // Get the current date
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = endDate - currentDate;

  // Calculate the remaining time in days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  const hours = Math.floor((timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((timeDifference % (60 * 1000)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds
  };
}

const openRefReceipt = (invoice) => {
  selected_invoice.value = invoice
  openRefReceiptDialog.value = true
  console.log(openRefReceiptDialog.value)
}

const closeHandle = () => {
  openInvoice.value = false
  openInvoiceII.value = false
  const body = document.body;
  body.style.backgroundColor = 'aliceblue';   
}

const refresh = () => {
  Documents.getInvoices().then((data) => {
    originalInvoices.value = data.data.reverse()
    invoices.value = originalInvoices.value
  });

  const currentTimestamp = Date.now();
  const options = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    new Date(currentTimestamp)
  );
  lastRefreshed.value = formattedTime;
}

const referQuotation = async () => {
  if ( refQuotation.value && refQuotation.value.customer_detail ) {
    console.log(refQuotation.value)
    customer.value = customers.value.find((item)=>item.customer_name===refQuotation.value.customer_detail.customer_name)
    selectedCustomer.value = customer.value
    selectedCompany.value = cpStore.myCompanies.find((item)=>item.Branch_company_name === refQuotation.value.customer_branch.Branch_company_name)
    company.value = selectedCompany.value
    openProductForm.value = false
    products.value = refQuotation.value.product_detail
    prod.value.project = {...refQuotation.value.project}
    discount.value = refQuotation.value.discount
    selectedSignature.value = refQuotation.value.signature
    bank.value = company.value.bank.find((item) => item.number === refQuotation.value.bank.status);
    sumVat.value = refQuotation.value.sumVat
    isWithholding.value = refQuotation.value.vat.percen_deducted ? true : false
    withholdingPercent.value = refQuotation.value.vat.percen_deducted ? refQuotation.value.vat.percen_deducted : null
    product_head.value = refQuotation.value.product_head
  } 
}

const referQuotationInput = async () => {
  if ( refQuotation.value && !refQuotation.value.customer_detail ) {
    refQuotation.value = quotations.value.find(item=>item.quotation===refQuotation.value)
    product_head.value = refQuotation.value.product_head
    prod.value.project = {...refQuotation.value.project}
    console.log('rfQT', refQuotation.value)   
    console.log('customers', customers.value)
    customer.value = customers.value.find((item)=>item.customer_name===refQuotation.value.customer_detail?.customer_name)
    selectedCustomer.value = customer.value
    selectedCompany.value = cpStore.myCompanies.find((item)=>item.Branch_company_name === refQuotation.value.customer_branch.Branch_company_name)
    company.value = selectedCompany.value
    openProductForm.value = false
    products.value = refQuotation.value.product_detail
    discount.value = refQuotation.value.discount
    selectedSignature.value = refQuotation.value.signature
    bank.value = company.value.bank.find((item) => item.number === refQuotation.value.bank.status);
    sumVat.value = refQuotation.value.sumVat
    isWithholding.value = refQuotation.value.vat.percen_deducted ? true : false
    transfer.value = refQuotation.value.transfer
  }
}

const credit = computed(()=>{
  return countDistinctDays(start_date.value, end_date.value)
})

const seeInvoice = (data) => {
  openInvoice.value = true;
  selectedInvoice.value = data;
  console.log("data", selectedInvoice.value);
  const body = document.body;
  body.style.backgroundColor = 'white';
}

const isPrice = ref(true);

const changeProductVat = () => {
  if (product.value.isVat && sumVat.value) {
    product.value.vat_price = product.value.product_price*0.07
  } else if (product.value.isVat && !sumVat.value) {
    product.value.vat_price = product.value.product_price*7/107
  }
  
  else {

    product.value.vat_price = 0

  }
}

function countDistinctDays(start_date, end_date) {
  // Convert input strings to Date objects
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(endDate - startDate);

  // Calculate the number of milliseconds in a day
  const millisecondsInDay = 24 * 60 * 60 * 1000;

  // Calculate the number of distinct days
  const distinctDays = Math.ceil(timeDifference / millisecondsInDay);

  return distinctDays;
}

const withholdingPrice = computed(() => {
  if (isWithholding.value && sumVat) {
    const result = (netVat.value * withholdingPercent.value) / 100;
    return result;
  } else {
    return 0;
  }
})

const addProduct = () => {
  if(!product.value) return
  product.value.product_price = sumVat.value
    ? product.value.product_price
    : product.value.product_price - (product.value.vat_price || 0)
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
  return netVat.value
})

const removeProduct = (index) => {
  if (products.value && products.value.length > 0) {
    products.value.splice(index, 1);
  }
}

const sumProductsPrice = computed(() => {
  if (products.value && products.value.length > 0) {
    const prices = products.value.map((pd) => {
      const result = (pd.product_price * pd.product_amount)
      return result;
    });
    const sumPrices = prices.reduce((a, b) => a + b, 0);
    return sumPrices;
  } else {
    return 0;
  }
});

const notSumVatsumProductsPrice = computed(()=>{
  if (prod.value.project.isVat && sumVat.value) {
    const result = sumProductsPrice.value
    return result;
  } else if (prod.value.project.isVat && !sumVat.value){
    const result = sumProductsPrice.value
    return result;
  } else {
    return 0;
  }
});

const netPrices = computed(() => {
  if (prod.value.project.isVat && sumVat.value) {
    return (sumProductsPrice.value+prod.value.project.total) - discount.value;
  } else if (prod.value.project.isVat && !sumVat.value){
    return (sumProductsPrice.value+prod.value.project.total-prod.value.project.vat_price) - discount.value;
  } else {
    return (sumProductsPrice.value+prod.value.project.total) - discount.value;
  }
});

const vat = computed(() => {
  const all_vat = products.value.map(item=>{
    return (item.vat_price || 0)*item.product_amount
  })
  const result = all_vat.length > 0 ? all_vat.reduce((a,b) => a + b, 0 ) : 0
  return result
});

const netVat = computed(() => {
  if ((prod.value.project.isVat || selectedCompany.value?.isVat) && sumVat.value) {
    const result = vat.value + netPrices.value + (prod.value.project.vat_price || 0);
    return result;
  } else if ((prod.value.project.isVat || selectedCompany.value?.isVat) && !sumVat.value){
    const result = vat.value + netPrices.value + (prod.value.project.vat_price || 0);
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
}

const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const reader = new FileReader();
  let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

  reader.readAsDataURL(blob)

  reader.onloadend = function () {
    const base64data = reader.result
    product.value.product_logo64 = base64data
  }

  uploadfiles.value.push(file)
  console.log(uploadfiles.value)
}

const refCustomer = () => {
  if (selectedCustomer.value) {
    customer.value = {...selectedCustomer.value};
  }
}

const refCompany = () => {
  if (selectedCompany.value) {
    company.value = selectedCompany.value;
  }
}

const formatCurrency = (value) => {
  if (value !== undefined && value !== null) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return;
}

const resetData = () => {
  invoice.value = {};
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
  refQuotation.value = null
}

const openNew = () => {
  resetData()
  submitted.value = false;
  invoiceDialog.value = true;
  product.value.product_text = [];
}

const hideDialog = () => {
  product.value = {};
  products.value = [];
  customer.value = {};
  invoiceDialog.value = false;
  invoiceEditDialog.value = false;
  submitted.value = false;
}

const editInvoice = (prodd) => {
  resetData()
  console.log('prodddd', prodd)
  invoice.value = { ...prodd };
  console.log("re", invoice.value);
  inputHeader.value = prodd.header || 'ใบแจ้งหนี้'
  start_date.value = prodd.start_date;
  end_date.value = prodd.end_date;

  const company = cpStore.myCompanies.find(
    (item) => item.Branch_company_name === prodd.customer_branch?.Branch_company_name
  );
  selectedCompany.value = company;

  const customered = customers.value.find(
    (item) => item.customer_name === prodd.customer_detail.customer_name
  );
  selectedCustomer.value = customered;
  refCustomer();
  product_head.value = prodd.product_head
  isWithholding.value = invoice.value.vat?.percen_deducted ? true : false;
  withholdingPercent.value = invoice.value.vat?.percen_deducted ? invoice.value.vat?.percen_deducted : null;
  discount.value = prodd.discount;
  products.value = prodd.product_detail;
  remark.value = prodd.remark;
  bank.value = company ? company.bank.find((item) => item.number === prodd.bank.status) : null;
  selectedSignature.value = cpStore.mySignatures.find((item) => item.name === prodd.signature.name);
  invoiceEditDialog.value = true;
  discount.value = 0
  prod.value.project = prodd.project
  product.value = {}
  product.value.product_text = [""]
  sumVat.value = prodd.sumVat
  end_period.value = prodd.end_period
  refQuotation.value = quotations.value.find(qt=>qt.quotation===invoice.value.quotation)
}

const totalPrice = (product) => {
  const price = product.product_detail.map((item)=>{
    return !product.sumVat ? (item.product_price*item.product_amount) - ((item.vat_price || 0) *item.product_amount) 
    : (item.product_price*item.product_amount)
  })
  const all_price = price.length > 0 ? price.reduce((a,b) => a + b, 0) : 0
  return all_price
}

const totalVat = (product) => {
  const vat = product.product_detail.map((item)=>{
    return (item.vat_price || 0) * item.product_amount
  })
  const result = vat.length > 0 ? vat.reduce((a,b) => a + b, 0) : 0
  return result
}

const confirmDeleteInvoice = (prod) => {
  invoice.value = prod;
  deleteInvoiceDialog.value = true;
}

const deleteInvoice = async () => {
  const invoices_to_delete = invoice.value;
  try {
    if (invoices_to_delete) {
      console.log(invoices_to_delete._id);
      await Documents.deleteInvoice(invoices_to_delete._id);
      Documents.getInvoices()
      reStore.getInvoices()
      refresh()
      invoice.value = {};
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "ลบใบแจ้งหนี้แล้ว",
        life: 3000,
      });
    }
  }
  catch(err){
    console.log(err)
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด",
      detail: "ลบใบแจ้งหนี้ล้มเหลว",
      life: 3000,
    });
  }
  finally {
    deleteInvoiceDialog.value = false;
  }
}

const withHolding = (product) => {
  if(product){
    const percent = product.vat ? product.vat.percen_deducted : 0
    const price = totalPrice(product)
    const result = percent > 0 ? price*percent/100 : 0
    return result
  }
}

const exportCSV = () => {
  dt.value.exportCSV();
}

const editProduct = (item) => {
  if(!item) return
  edittingProduct.value = item
  product.value = item
  product.value.product_logo64 = item.product_logo64 ? item.product_logo64 : []
  product.value.product_logo = item.product_logo
  product.value.isVat = item.vat_price && item.vat_price > 0 ? true : false
  openProductForm.value = true
}

const confirmDeleteSelected = () => {
  deleteInvoicesDialog.value = true;
}

const deleteSelectedInvoices = async () => {
  try {
    const invoices_to_delete = invoices.value
      .filter((val) => !selectedInvoices.value.includes(val))
  if (
    invoices_to_delete.length > 0 &&
    selectedInvoices.value.length !== invoices.value.length
  ) {
      for (let qt of selectedInvoices.value) {
        console.log(qt._id);
        await Documents.deleteInvoice(qt._id);
      }
  } else if (selectedInvoices.value.length === invoices.value.length) {
    await Documents.deleteInvoices();
  }
    selectedInvoices.value = null;
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "ลบใบแจ้งหนี้แล้ว",
      life: 3000,
    });
  }
  catch (err) {
    console.log(err)
  }
  finally {
    deleteInvoicesDialog.value = false
    loading.value = false
    Documents.getInvoices()
    reStore.getInvoices()
    refresh()
  }
}

const createNewInvoice = async () => {
  loading.value = true;
  /* let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  }); */
  const data = {
    header: inputHeader.value,
    quotation: refQuotation.value ? refQuotation.value.quotation : null,
    //invoice: refInvoice.value.invoice,
    customer_number: customer.value ? customer.value.customer_number : null,
    branchId: selectedCompany.value ? selectedCompany.value._id : null,
    signatureID: selectedSignature.value ? selectedSignature.value._id : null,
    customer_detail: {
      tax_id: customer.value ? customer.value.customer_taxnumber : null,
      customer_name: customer.value ? customer.value.customer_name : null,
      customer_lastname: customer.value ? customer.value.customer_lastname : null,
      customer_phone: customer.value ? customer.value.customer_phone : null,
      customer_email: customer.value ? customer.value.customer_email : null,
      customer_address: customer.value ? customer.value.customer_position : null,
      customer_type: customer.value ? customer.value.customer_type : null,
      customer_contact: customer.value ? customer.value.customer_contact : null,
      customer_contact_number: customer.value ? customer.value.customer_contact_number : null,
    },
    project: prod.value.project,
    product_head: product_head.value,
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    bank: bank.value && transfer.value === 'bank' ? {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    } : {
      name: '',
      remark_2: '',
      status: '',
    },
    isVat: selectedCompany.value ? selectedCompany.value.isVat : null,
    sumVat: sumVat.value,
    credit: credit.value,
    end_period: end_period.value,
    cur_period: cur_period.value,
    transfer: transfer.value
  };
  console.log(data);
  let product_detail = [];
  let inId = null;
  try {
    const response = await Documents.createNewInvoice(data);
    if (response.data.data) {
      product_detail = [...response.data.product_detail];
      inId = response.data._id;
      /* img = response.data.product_detail;
      qtId = response.data._id; */
      const imgId = product_detail.map((id) => id._id);
      if (imgId.length > 0) {
        product_detail.forEach(async (image, index) => {
          try {
              const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/quotation/uploadPicProduct/${qtId}/${imgId}`,
                image,
                {
                  headers: {
                    'auth-token' : import.meta.env.VITE_TOKEN
                  }
                }
              )
              if (response.data.status) {
                console.log(response.data)
                toast.add({
                  severity: "success",
                  summary: "สำเร็จ",
                  detail: "อัพรูปใบเสนอราคาแล้ว",
                  life: 3000,
                });
              }
            }
            catch (e) {
              console.log(e);
              toast.add({
                severity: "error",
                summary: "สร้างใบเสนอราคาแล้ว",
                detail: "ไม่สามารถอัพโหลดรูปภาพ",
                life: 3000,
              });
            }
        })
      } else {
        console.log(response.data.data.product_detail);
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "สร้างใบแจ้งหนี้แล้ว",
          life: 3000,
        });
      }
    } 
  } 
  catch (err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "สร้างใบแจ้งหนี้ล้มเหลว",
      life: 3000,
    })
  }
  finally {
    invoiceDialog.value = false;
    loading.value = false;
    prod.value.project = {};
    refresh();
  }
}

const editingProductInvoice = async () => {
  loading.value = true;
  const data = {
    product_detail: products.value
  }
  try {
    const response = await Documents.editInvoice(invoice.value._id, data);
    if (response.data) {
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "อัพเดทใบแจ้งหนี้แล้ว",
        life: 3000,
      });
    } 
  } 
  catch(err) {
    console.log(err);
  }
  finally {
    loading.value = false;
    invoiceEditDialog.value = false;
    refresh()
  }
};

const editingInvoice = async () => {
  loading.value = true;
  /* let img = [];
  let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  }); */
  console.log(refQuotation.value)
  console.log(selectedCompany.value)
  const data = {
    header: inputHeader.value,
    quotation: refQuotation.value ? refQuotation.value.quotation : null,
    customer_number: customer.value ? customer.value.customer_number : null,
    branchId: selectedCompany.value ? selectedCompany.value._id : null,
    signatureID: selectedSignature.value ? selectedSignature.value._id : '',
    customer_detail: customer.value ? {
      tax_id: customer.value.customer_taxnumber,
      customer_name: selectedCustomer.value.customer_name,
      customer_lastname: customer.value.customer_lastname,
      customer_phone: customer.value.customer_phone,
      customer_email: customer.value.customer_email,
      customer_address: customer.value.customer_position,
      customer_type: customer.value.customer_type,
      customer_contact: customer.value.customer_contact,
      customer_contact_number: customer.value.customer_contact_number,
    } : null,
    product_head: product_head.value,
    project: prod.value.project,
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    isVat: selectedCompany.value ? selectedCompany.value.isVat : null,
    bank: bank.value && transfer.value === 'bank' ? {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    } : {
      name: '',
      remark_2: '',
      status: '',
    },
    cur_period: cur_period.value,
    credit: credit.value,
    transfer: transfer.value
  };
  console.log(data)
  try {
    const response = await Documents.editInvoice(invoice.value._id, data);
    if (response.data) {
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "อัพเดทใบแจ้งหนี้แล้ว",
        life: 3000,
      });
      //await editingProductInvoice()
    } 
  } 
  catch(err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: "อัพเดทใบแจ้งหนี้ล้มเหลว",
      life: 3000,
    });
  }
  finally {
    loading.value = false;
    invoiceEditDialog.value = false;
    refresh();
  }
}

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
}

const hoverMenu = ref(false)
const openMenus = ref(null)
const blurMenu = (val) => {
  if (!hoverMenu.value) {
    openMenus.value = null
  }
}

const seeInvoiceRef = (val, period) => {
  console.log(val.status)
  console.log(period)
  const index = period-2
  let prev_paid = 0

  if ( index >= 0 ) {
    let sumPrevPaid = 0
    for (let i=0; i < index+1 ; i++) {
      sumPrevPaid += val.status[i].paid
    }
    prev_paid = sumPrevPaid
  } else {
    prev_paid = 0
  }
  console.log(prev_paid)
  seeInvoiceII(val, period, prev_paid)
  openMenus.value = null
  hoverMenu.value = false
}

const seeInvoiceII = (data, period, prev_paid) => {
  openInvoiceII.value = true;
  selectedInvoice.value = data;
  selectedInvoice.value.prev_paid = prev_paid
  selectedInvoice.value.thisperiod = period
  console.log("data", selectedInvoice.value);
  const body = document.body;
  body.style.backgroundColor = 'white';
}

const nextInvoice = ref({})
const openNextInvoiceDialog = ref(false)
const openNextInvoice = (val) => {
  openNextInvoiceDialog.value = true
  selectedInvoice.value = val
  console.log(selectedInvoice.value)
}
const createNextInvoice = async () => {
  loading.value = true
  const id = selectedInvoice.value._id
  const body = {
    start_date: nextInvoice.value.start_date,
    end_date: nextInvoice.value.end_date,
    period: nextInvoice.value.period
  }
  const { data } = await axios.put(
    `${import.meta.env.VITE_API_URL}/invoice/nextInvoice/${id}`,
    body,
    {
      headers: {
        'auth-token' : import.meta.env.VITE_TOKEN,
        'Content-type' : 'application/json'
      }
    }
  )
  if (data.data && data.status) {
    console.log(data.data)
    nextInvoice.value = {}
    selectedInvoice.value = {}
    openNextInvoiceDialog.value = false
    loading.value = false
    Documents.getInvoices().then((data) => {
      originalInvoices.value = data.data.reverse()
      invoices.value = originalInvoices.value
    })
  } else {
    console.log(data.data)
    loading.value = false
  }
}

const curfilter = ref('ทั้งหมด')
const filterInvoice = () => {
  const filter = curfilter.value
  if ( filter === 'ยังไม่ครบ' ) {
    invoices.value = originalInvoices.value.filter((inv)=>(
      totalPrice(inv) - inv.discount + totalVat(inv) - (inv.paid || 0) > 0
    ))
  } else if ( filter === 'ครบแล้ว' ) {
    invoices.value = originalInvoices.value.filter((inv)=>(
      totalPrice(inv) - inv.discount + totalVat(inv) - (inv.paid || 0) <= 0
    ))
  }
  else {
    invoices.value = originalInvoices.value
  }
}

</script>
