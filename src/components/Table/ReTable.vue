<template>
  <div class="h-full">
    <Toast />
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openFullReceipt"
    >
      <DocReceipt v-if="selectedReceipt.invoice && selectedReceipt.invoiceRef_detail?.period_text !== '1/1'" :color="color" :data="selectedReceipt" :isSign="sign" @close="closeHandle" />
      <DocReceipt1 v-else :color="color" :data="selectedReceipt" :isSign="sign" @close="closeHandle" />
    </div>
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openSmallReceipt"
    >
      <DocReceiptRef2 :isSign="sign" :color="color" :data="selectedReceipt" @close="closeHandle" />
      
    </div>

    <div class="card" :class="!openFullReceipt && !openSmallReceipt ? '' : 'hidden'">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="เพิ่ม"
            icon="pi pi-plus"
            severity="success"
            class="mr-4"
            :loading="loading"
            @click="openNew"
          />
          <Button
            label="เพิ่มจากใบแจ้งหนี้"
            icon="pi pi-plus"
            severity="success"
            :loading="loading"
            class="mr-4 hidden md:block text-sm"
            @click="openNewRef"
          />
          <Button
            label="ลบ"
            icon="pi pi-trash"
            severity="danger"
            :loading="loading"
            @click="confirmDeleteSelected"
            :disabled="!selectedReceipts || !selectedReceipts.length"
          />
          <Button icon="pi pi-refresh" @click="refresh" />
          <small class="opacity-60">{{ lastRefreshed }}</small>
          <Calendar :disabled="seeAll" class="px-5" v-model="month" showIcon :showOnFocus="false" :showButtonBar="true" inputClass="p-2 bg-green-100 text-center w-24" inputId="buttondisplay" view="month" dateFormat="mm/yy" />
          <p :class="seeAll ? 'opacity-0' : ''" class="pr-2">ประจำเดือน <span class="font-bold text-green-700 underline">{{ getMonthString(month.getMonth()) }} {{ month.getFullYear() + 543 }}</span></p>
          <div class="flex items-center border px-2 py-1 rounded bg-slate-100">
            <Checkbox v-model="seeAll" inputId="dateFilter" name="dateFilter" :binary="true" />
            <label for="dateFilter" class="ml-2"> ดูทั้งหมด </label>
          </div>
        </template>

        <template #end>
          <Button
            label="ดาวน์โหลดไฟล์"
            icon="pi pi-upload"
            class="mr-4"
            :loading="loading"
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
        :value="receipts"
        v-model:selection="selectedReceipts"
        dataKey="_id"
        :paginator="true"
        :rows="5"
        :filters="filters"
        paginatorPosition="top"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="{currentPage} / {totalRecords}"
        :pt="{
          header: { style: `backgroundColor: #${color}` },
        }"
      >
        <template #header>
          <div class="flex flex-wrap gap-y-2 w-full gap-x-4 items-center justify-between">
            <h4 class="m-0">จัดการเอกสาร</h4>
            <SelectButton v-model="curfilter" :options="['ทั้งหมด', 'Vat', 'ไม่มี Vat']" aria-labelledby="basic" />
            <span class="p-input-icon-right border rounded">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" class="px-3" placeholder="ค้นหา..." />
            </span>
            <div class="flex gap-3 self-end items-center bg-slate-300 px-3 py-1 rounded">
              <Checkbox v-model="sign" :binary="true" />
              <p>ลายเซ็นอิเล็กทรอนิกส์</p>
            </div>
          </div>
          <div class="flex justify-center relative top-3">
            <p>
              หน้าปัจจุบัน
              <span class="bg-green-500 w-fit px-2 rounded-full text-white text-center">{{ curPage }}</span>
            </p>
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
          style="min-width: 8rem"
          class="border-b text-sm"
        >
          <template #body="slotProps">
            <p v-if="slotProps.data.isBillVat" class="text-orange-500">
              {{ slotProps.data.receiptVat }}
              {{ slotProps.data.receipt }}
            </p>
            <p v-else-if="slotProps.data.isBillVat === false" class="text-black">
              {{ slotProps.data.receiptNoVat }}
              {{ slotProps.data.receipt }}
            </p>
            <p v-else class="text-gray-500">
              {{ slotProps.data.receipt }}
            </p>
          </template>
        </Column>
        <Column
          field="invoice"
          header="อ้างอิง"
          sortable
          style="min-width: 8rem"
          class="border-b text-sm"
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
          style="min-width: 12rem"
          class="border-b text-sm"
        ></Column>
        <Column
          field="start_date_format"
          header="วันที่ออกเอกสาร"
          class="border-b text-sm"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            fotmat: {{ slotProps.data.start_date_format }}
            rawstart: {{ new Date(slotProps.data.start_date).toLocaleDateString() }}
            created: {{ new Date(slotProps.data.createdAt).toLocaleDateString() }}
          </template>
        </Column>

        <Column
          field="amount_price"
          class="border-b text-sm"
          header="ราคา"
          sortable
          style="min-width: 8rem"
        >
          <template #body="slotProps">
            <span v-if="slotProps.data.amount_price >= 0 && slotProps.data.invoice && slotProps.data.amount_price > slotProps.data.net && slotProps.data.net > 0">
              {{ formatCurrency(slotProps.data.amount_price) }}
            </span>
            <span v-else-if="slotProps.data.amount_price >= 0 && slotProps.data.invoice && slotProps.data.amount_price <= slotProps.data.net && slotProps.data.net >= 0">
              {{ formatCurrency(slotProps.data.amount_price) }}
            </span>
            <span v-else-if="slotProps.data.amount_price >= 0 && !slotProps.data.invoice">
              {{ formatCurrency(slotProps.data.amount_price) }}
            </span>
            <span v-else>
              {{ formatCurrency(slotProps.data.amount_price) }}
            </span>
            
            <span class="hidden">
              {{
                slotProps.data.sumVat
                  ? formatCurrency(
                      totalPrice(slotProps.data) -
                        slotProps.data.discount +
                        (slotProps.data.project?.total || 0) +
                        (slotProps.data.project?.vat_price || 0) +
                        totalVat(slotProps.data)
                    )
                  : formatCurrency(
                      totalPrice(slotProps.data) -
                        slotProps.data.discount +
                        (slotProps.data.project?.total || 0) +
                        totalVat(slotProps.data)
                    )
              }}
            </span>
          </template>
        </Column>
        <Column
          field='vat.totalvat'
          header="VAT 7%"
          sortable
          style="max-width: 8rem"
          class="border-b text-sm"
        >
          <template #body="slotProps">
            <div class="grid place-items-center w-full">
              <span
                class="text-sm text-center"
                :class="slotProps.data.isVat ? 'text-orange-500 bg-yellow-200 px-2 rounded' : ''"
              >
                {{ slotProps.data.isVat && slotProps.data.sumVat ? "VAT นอก" : slotProps.data.isVat && !slotProps.data.sumVat ? "VAT ใน" : "-" }}
              </span>
            </div>
          </template>
        </Column>
        <Column
          field="vat.total_deducted"
          header="หัก ณ ที่จ่าย"
          class="border-b text-sm"
          sortable
          style="max-width: 10rem"
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
        <Column
          field="status[status.length-1].name"
          header="กระทบยอด"
          class="border-b text-sm"
          sortable
          style="max-width: 8rem"
          :exportable="false"
        >
          <template #body="slotProps">
            <div class="grid place-items-center w-full opacity-30" v-if="slotProps.data.status[slotProps.data.status.length-1]?.name === 'new'">
              <Button :loading="loading" icon="pi pi-file-export" disabled />
              <small>coming sonn..</small>
            </div>
          </template>
        </Column>
        <Column :exportable="false" style="min-width: 15rem" class="border-b">
          <template #body="slotProps">
            <div class="flex flex-wrap gap-1 justify-center items-center">
              <!-- v-if="slotProps.data.invoice && slotProps.data.invoiceRef_detail.period_text !== '1/1'" -->
              <Button
                class="text-blue-600 hover:bg-blue-100 px-1"
                
                :disabled="!slotProps.data.invoice"
                icon="pi pi-file"
                :loading="loading"
                outlined
                rounded
                @click="seeSmallReceipt(slotProps.data)"
              />
              <Button
                class="text-green-600 hover:bg-green-100 px-1"
                icon="pi pi-file"
                label="แบบเต็ม"
                outlined
                rounded
                :loading="loading"
                @click="seeFullReceipt(slotProps.data)"
              />
              <Button
                class="text-yellow-600 hover:bg-orange-100"
                icon="pi pi-pencil"
                outlined
                rounded
                @click="editReceipt(slotProps.data)"
              />
              <Button
                class="text-pink-600 hover:bg-orange-100"
                :class="!slotProps.data.invoice ? 'opacity-10' : 'opacity-100'"
                :disabled="!slotProps.data.invoice"
                icon="pi pi-bars"
                outlined
                rounded
                @click="edittingReceiptRefInvoice(slotProps.data)"
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
      header="เพิ่มใบเสร็จรับเงิน"
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
        <div class="card flex flex-col gap-y-2 py-4 justify-center items-center">
          <p>วันที่ออกเอกสาร Date</p>
          <Calendar
            class="border"
            v-model="start_date"
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </div>
        <div>
          <p class="text-lg font-semibold py-1">หัวเอกสาร</p>
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
              >{{ customer.customer_name }}
              {{ customer.customer_lastname ? `(${customer.customer_lastname})` : "" }}
            </span>
          </div>
        </div>

        <div class="field">
          <label for="customer_name">ชื่อลูกค้า</label>
          <InputText
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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

          <div v-if="selectedCompany?.isVat" class="flex py-2 align-items-center">
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
        <div class="field pt-2">
          <label for="customer_contact">ผู้ติดต่อ</label>
          <InputText
            class="p-2 border-2 bg-slate-100 focus:bg-white"
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
            class="p-2 bg-slate-100 focus:bg-white border"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />

      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>

      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <InputText v-model="project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <InputNumber v-model="project.amount" inputId="integeronly" />
                <InputText v-model="project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <InputNumber v-model="project.price" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" />
            </div>
            <pre class="hidden">
              {{ 
                project.isVat && sumVat
                ? project.vat_price = project.total*0.07
                : project.isVat && !sumVat
                ? project.vat_price = project.total*7/107
                : 0
              }}
            </pre>

            <div class="py-3" v-if="sumVat">
              <p>ราคาสินค้า/บริการ</p>
              <pre class="hidden">{{ project.total = (project.price * project.amount) || 0 }}</pre>
              <inputNumber v-model="project.total" />
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0 && !sumVat">
              <p>ราคาสินค้า/บริการ</p> 
              <p class="">{{ formatCurrency(project.total-project.vat_price) }}</p>
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0">
              <p>VAT 7%</p> 
              <p class="">{{ formatCurrency(project.vat_price) }}</p>
            </div>
            
            <div class="py-3" v-if="!sumVat">
              <p>ราคาสินค้า/บริการ 
                <span class="px-2 text-sm bg-yellow-300">
                  {{ 'รวม Vat' }}
                </span>
              </p>
              <pre class="hidden">{{ project.total = (project.price * project.amount) || 0 }}</pre>
              <inputNumber v-model="project.total" />
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0 && sumVat">
              <p>ราคาสินค้า/บริการ<span class="px-2 text-sm bg-yellow-300">
                {{ 'รวม Vat' }}
              </span></p> 
              <p class="">{{ formatCurrency(project.total+project.vat_price) }}</p>
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
              product.product_logo = []
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

        <div v-if="project.isVat && !sumVat">
          <p>ราคารวม
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+vat+(project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="project.isVat && sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0)) || 0
            }}</span>
          </p>
        </div>

        <div v-if="project.isVat && !sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0)-project.vat_price) || 0
            }}</span>
          </p>
        </div>

        <div v-if="!project.isVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0))
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
        <p v-if="project.isVat">
          VAT 7% 
          <span class="border-b px-2">
            {{ formatCurrency(vat+(project.vat_price || 0)) || 0 }}
          </span>
        </p>
        <pre class="hidden">
          {{
            project.total_net = project.isVat && sumVat ? project.total + project.vat_price : project.isVat && !sumVat ? project.total
            : 0
          }}
        </pre>
        <p v-if="project.isVat">
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

      <div class="border rounded px-3 py-2 items-center border-green-700">
        <div class="flex items-center gap-x-3 py-2">
          <p class="text-lg font-bold">ยอดชำระ : </p>
          <input type="number" v-model="amount_price" >
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
        <Button label="ยกเลิก" text @click="hideDialog" />
        <Button
          label="บันทึก"
          class="text-green-700 px-2 border border-green-700 hover:bg-green-100 duration-300"
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
      header="แก้ไขใบเสร็จรับเงิน"
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
        <div class="card flex flex-col gap-y-2 py-4 justify-center items-center">
          <p>วันที่ออกเอกสาร Date</p>
          <Calendar
            class="border"
            v-model="start_date"
            showButtonBar
            dateFormat="dd/mm/yy"
          />
        </div>
        <div>
          <p class="text-lg font-semibold py-1">หัวเอกสาร</p>
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
              >{{ customer.customer_name }}
              {{ customer.customer_lastname ? `(${customer.customer_lastname})` : "" }}
            </span>
          </div>
        </div>

        <div class="field">
          <label for="customer_name">ชื่อลูกค้า</label>
          <InputText
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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
            class="p-2 bg-slate-100 focus:bg-white border"
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

          <div v-if="selectedCompany?.isVat" class="flex py-2 align-items-center">
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
        <div class="field pt-2">
          <label for="customer_contact">ผู้ติดต่อ</label>
          <InputText
            class="p-2 border-2 bg-slate-100 focus:bg-white"
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
            class="p-2 bg-slate-100 focus:bg-white border"
            id="customer_contact_number"
            v-model.trim="customer.customer_contact_number"
            required="false"
            autofocus
            :class="{ 'p-invalid': submitted && !customer.customer_contact_number }"
          />
        </div>
      </div>
      <br />

      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>

      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <InputText v-model="project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <InputNumber v-model="project.amount" inputId="integeronly" />
                <InputText v-model="project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <InputNumber v-model="project.price" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" />
            </div>
            <pre class="hidden">
              {{ 
                project.isVat && sumVat
                ? project.vat_price = project.total*0.07
                : project.isVat && !sumVat
                ? project.vat_price = project.total*7/107
                : 0
              }}
            </pre>

            <div class="py-3" v-if="sumVat">
              <p>ราคาสินค้า/บริการ</p>
              <pre class="hidden">{{ project.total = (project.price * project.amount) || 0 }}</pre>
              <inputNumber v-model="project.total" />
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0 && !sumVat">
              <p>ราคาสินค้า/บริการ</p> 
              <p class="">{{ formatCurrency(project.total-project.vat_price) }}</p>
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0">
              <p>VAT 7%</p> 
              <p class="">{{ formatCurrency(project.vat_price) }}</p>
            </div>
            
            <div class="py-3" v-if="!sumVat">
              <p>ราคาสินค้า/บริการ 
                <span class="px-2 text-sm bg-yellow-300">
                  {{ 'รวม Vat' }}
                </span>
              </p>
              <pre class="hidden">{{ project.total = (project.price * project.amount) || 0 }}</pre>
              <inputNumber v-model="project.total" />
            </div>

            <div class="py-2" v-if="project.isVat && project.vat_price!==0 && sumVat">
              <p>ราคาสินค้า/บริการ<span class="px-2 text-sm bg-yellow-300">
                {{ 'รวม Vat' }}
              </span></p> 
              <p class="">{{ formatCurrency(project.total+project.vat_price) }}</p>
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
              product.product_logo = []
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

        <div v-if="project.isVat && !sumVat">
          <p>ราคารวม
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0)-discount+vat) || 0
            }}</span>
          </p>
        </div>

        <div v-if="project.isVat && sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0)-discount+vat) || 0
            }}</span>
          </p>
        </div>

        <div v-if="project.isVat && !sumVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0)-project.vat_price) || 0
            }}</span>
          </p>
        </div>

        <div v-if="!project.isVat">
          <p>ราคาสินค้า/บริการ
            <span class="border-b px-2">{{
              formatCurrency(sumProductsPrice+(project.total || 0))
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
        <p v-if="project.isVat">
          VAT 7% 
          <span class="border-b px-2">
            {{ formatCurrency(vat+(project.vat_price || 0)) || 0 }}
          </span>
        </p>
        <pre class="hidden">
          {{
            project.total_net = project.isVat && sumVat ? project.total + project.vat_price : project.isVat && !sumVat ? project.total
            : 0
          }}
        </pre>
        <p v-if="project.isVat">
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

      <div class="border rounded px-3 py-2 items-center border-green-700">
        <div class="flex items-center gap-x-3 py-2">
          <p class="text-lg font-bold">ยอดชำระ : </p>
          <input type="number" v-model="amount_price" >
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
        <Button label="ยกเลิก" text @click="hideDialog" />
        <Button
          label="บันทึก"
          class="text-green-700 px-2 border border-green-700 hover:bg-green-100 duration-300"
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
          >คุณแน่ใจว่าต้องการลบเอกสารนี้หรือไม่ ?
          <b v-if="receipt.isBillVat" class="text-orange-500">
            {{ receipt.receiptVat }}
          </b>
          <b v-else-if="receipt.isBillVat === false">
            {{ receipt.receiptNoVat }}
          </b>
          <b v-else>
            {{ receipt.receipt }}
          </b>?
          </span
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
      header="เพิ่มใบเสร็จรับเงิน"
      :modal="true"
      class="p-fluid"
    >

      <div v-show="!invoices || invoices.length === 0" class="bg-black/30 rounded-lg h-[650px] w-full animate-pulse">
      </div>
      <div v-if="invoices && invoices.length > 0" class="card flex flex-col gap-y-2 bg-sky-300 py-2 px-2 rounded-lg justify-content-center">
        <Dropdown
          v-model="refInvoice"
          editable
          :options="invoices"
          optionLabel="invoice"
          placeholder="เลือกใบแจ้งหนี้"
          class="w-full md:w-14rem"
        />
      </div>
      <p class="p-2 hidden text-center">{{ ivref?.remark }}</p>
      <pre class="my-2 border">
        "สำหรับตรวจสอบ"
        หัวบิล VAT : {{ refInvoice?.isVat }}
        ประเภท VAT : {{ refInvoice?.sumVat ? 'vat นอก' : 'vat ใน' }}
        ราคาโปรเจค : {{refInvoice?.project?.total}}
        ราคาสินค้า/บริการ : {{refInvoice?.total}}
        ส่วนลด : {{refInvoice?.discount}}
        ราคารวม (ก่อน VAT) : {{ net_raw = (refInvoice?.total + refInvoice?.project?.total) - refInvoice?.discount }}
        VAT 7% : {{ prod_vat = Math.round(calVat(refInvoice?.product_detail) + ((refInvoice?.project?.vat_price || 0))) }}
        ราคาสุทธิ : {{ result = refInvoice?.sumVat && refInvoice?.isVat ? net_raw + prod_vat : net_raw }}
      </pre>
      <div class="flex justify-center items-center gap-x-2">
        <label>งวดที่</label>
        <input type="number" v-model="cur_period" class="px-2 py-1 border rounded text-center w-fit max-w-[5rem]">
      </div>
      <p class="w-full text-center" v-if="ivref?.price">ราคางวดย่อย : {{ ivref?.price }}</p>
      <div v-if="invoices && invoices.length > 0" class="card">
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
          <div class="flex items-center">
              <RadioButton class=" bg-green-900 rounded-full" v-model="transfer" inputId="cash" name="cash" value="cash" />
              <label for="ingredient1" class="ml-2">เงินสด</label>
          </div>
          <div class="flex items-center">
              <RadioButton class=" bg-green-900 rounded-full" v-model="transfer" inputId="bank" name="bank" value="bank" />
              <label for="ingredient2" class="ml-2">โอนผ่านบัญชีธนาคาร</label>
          </div>
        </div>
        <div class="flex gap-3 justify-start items-center" v-if="transfer==='bank' && refInvoice">
          <small>{{ refInvoice?.bank?.name }} ({{ refInvoice?.bank?.remark_2 }})</small>
          <small>{{ refInvoice?.bank?.status }}</small>
        </div>
        <div class="py-3">
          <strong>จำนวนเงิน</strong>
          <div class="flex flex-wrap items-center gap-3 py-4">
            <div class="flex items-center">
                <RadioButton class=" bg-green-900 rounded-full" v-model="ref_paid" inputId="cash" name="cash" :value="true" />
                <label for="ingredient1" class="ml-2">ยอดเต็ม</label>
            </div>
            <div class="flex items-center">
                <RadioButton class=" bg-green-900 rounded-full" v-model="ref_paid" inputId="bank" name="bank" :value="false" />
                <label for="ingredient2" class="ml-2">กำหนดเอง</label>
            </div>
          </div>
          
          <InputGroup class="border rounded">
            <InputGroupAddon><span class="font-bold px-2">THB</span></InputGroupAddon>
            <InputNumber v-model="amount_price" inputId="minmaxfraction" :minFractionDigits="2" :maxFractionDigits="5" />
            <InputGroupAddon>บาท</InputGroupAddon>
          </InputGroup>
        </div>
        <div class="py-3 flex flex-col">
          <strong>รายละเอียด</strong>
          <textarea v-model="paid_detail" class="border">
          </textarea>
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
        <div v-if="invoices && invoices.length > 0" class="flex gap-3">
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

    <Dialog
      v-model:visible="editReceiptRefInvoiceDialog"
      :style="{ width: '500px' }"
      header="Receipt Details"
      :modal="true"
      class="p-fluid"
    >
      <div class="card flex flex-col gap-y-2 bg-sky-300 py-2 px-2 rounded-lg justify-content-center">
        <p>แก้ไขรายละเอียดใบเสร็จ</p>
        <p v-if="receipt.isBillVat">
          {{ receipt.receiptVat }}
        </p>
        <p v-else-if="receipt.isBillVat === false">
          {{ receipt.receiptNoVat }}
        </p>
        <p v-else>
          {{ receipt.receipt }}
        </p>
      </div>
      <div class="card">
        
        <div class="py-3 flex flex-col">
          <strong>รายละเอียด</strong>
          <textarea v-model="paid_detail" class="border">
          </textarea>
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
            @click="editReceiptRefInvoice(receipt._id)"
            class="text-bold text-green-500 hover:bg-green-100 border border-green-500 px-3"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, watchEffect } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { Documents } from "@/service/ProductService";
import { Customers } from "@/service/Customer";
import { useReceiptStore } from "@/stores/receipt";
import { useCompanyStore } from "@/stores/company";
import DocReceiptRef from "@/components/Pdf/DocReceiptRef.vue";
import DocReceiptRef2 from "@/components/Pdf/DocReceiptRef2.vue";
import DocReceipt from "@/components/Pdf/DocReceipt.vue";
import DocReceipt1 from "@/components/Pdf/DocReceipt1.vue";

const reStore = useReceiptStore();
const cpStore = useCompanyStore();

const invoices = ref([]);

onMounted(async () => {
  Documents.getReceipts().then((data) => {
    originalReceipts.value = data.data.reverse()
    originalReceipts.value.forEach(re => {
      /* re.receipt = 
        re.isBillVat ? re.receiptVat
        : re.isBillVat === false ? re.receiptNoVat
        : re.receipt */

      re.vat.totalvat = 
        re.isVat && re.sumVat ? (re.project?.vat_price || 0) + totalVat(re)
        : re.isVat && !re.sumVat ? totalVat(re)
        : 0

      re.vat.total_deducted = 
        re.vat.percen_deducted ? (re.vat.percen_deducted/100)*re.amount_price
        : null

      re.start_date_format = formatDateRef(re.start_date)
    })
  });
  Documents.getQuotations().then((data) => (quotations.value = data.data));
  Customers.getCustomers().then((data) => (customers.value = data.data));
  await cpStore.getMyCompanies();
  await cpStore.getMySignatures();
  await fetchInvoices();
});

const prod = ref({
  project: {},
  product_detail: []
});

const curfilter = ref("ทั้งหมด")
const result = ref()
const ref_paid = ref(false)
const editReceiptRefInvoiceDialog = ref(false)
const transfer = ref('bank')
const quotations = ref([]);
const lastRefreshed = ref();
const openFullReceipt = ref(false);
const openSmallReceipt = ref(false);
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
//const receipts = ref();
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
const product_head = ref('');
const edittingProduct = ref();
const paid_detail = ref('')
const isSign = ref(false)
const sign = ref(false)
const project = ref({});
const isPrice = ref(true);
const files = ref([]);
const curPage = ref(1)
const cur_period = ref(1)
const seeAll = ref(false)
const month = ref(new Date())
const originalReceipts = ref([])

const getMonthString = (monIndex) => {
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]

  return thaiMonths[monIndex]
}

const monthYear = computed(()=>{
  const thisMonth = (month.value.getMonth()+1).toString().padStart(2, '0')
  const thisYear = month.value.getFullYear() + 543
  const thisMonthYear = `${thisMonth}/${thisYear}`
  return thisMonthYear
})

const filterdReceipts = computed(()=>{
  let result = []
  if (!seeAll.value) {
    result = originalReceipts.value.filter( re => 
      formatDateRef(re.start_date).substring(3) === monthYear.value
    )
  } else {
    result = originalReceipts.value
  }

  return result
})

const receipts = computed(()=>{
  let result = []
  const filter = curfilter.value
  if ( filter === 'Vat' ) {
    result = filterdReceipts.value.filter(re=>re.isVat)
  } else if ( filter === 'ไม่มี Vat' ) {
    result = filterdReceipts.value.filter(re=>!re.isVat)
  }
  else {
    result = filterdReceipts.value
  }

  return result
})
const amount_price = ref(0);
// Create with reference invoice
const refInvoice = ref();
const { ivref } = defineProps(["ivref"])
const invref = ref(ivref)
const receiptRefInvoiceDialog = ref(false);
watchEffect(()=> {
  console.log(ivref)
  console.log(invref.value?.code?.split('-')[0])
  if (invref.value && invref.value?.code?.includes('-')) {
    refInvoice.value = invoices.value.find(i=>i.invoice===invref.value?.code?.split('-')[0] || i.invoice===invref.value?.code[0])
    cur_period.value = parseInt(invref.value?.code?.split('-')[1])
    console.log('refInvoice', refInvoice.value)
    amount_price.value = ivref?.price
    paid_detail.value = ivref?.remark
    receiptRefInvoiceDialog.value = true
  } else if (invref.value && !invref.value?.code?.includes('-')) {
    console.log('invref', invref.value)
    refInvoice.value = invoices.value.find(i=>i.invoice===invref.value?.invoice)
    cur_period.value = 1
    paid_detail.value = ivref?.remark?.join(' ')
    console.log('refInvoice', refInvoice.value)
    receiptRefInvoiceDialog.value = true
  }
})

watch((invref), (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (invref.value && invref.value?.includes('-')) {
    refInvoice.value = invoices.value.find(i=>i.invoice===invref.value.split('-')[0])
    cur_period.value = parseInt(invref.value.split('-')[1])
    receiptRefInvoiceDialog.value = true
  } else if (invref.value && !invref.value?.includes('-')) {
    refInvoice.value = invoices.value.find(i=>i.invoice===invref.value)
    cur_period.value = 1
    receiptRefInvoiceDialog.value = true
  }
  }
})

watch(() => dt?.value?.d_first, (newVal, oldVal) => {
  if (dt.value) {
    curPage.value = 
    dt.value.d_first === 0 ? 1 
    : (dt.value.d_first/dt.value.d_rows) + 1
  }
})

watch(() => ref_paid.value, (newVal, oldVal) => {
  if ( ref_paid.value ) {
    amount_price.value = result.value
  } else {
    amount_price.value = 0
  }
})

function openNewRef() {
  //resetRefInvoice();
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

const isAmount = ref(true)

const choosesumVat = ref('Vat นอก');

watch(() => project.value.isVat, (newValue, oldValue) => {
  if(!newValue) {
    project.value.vat_price = 0
  }
})

const changesumVat = () => {
  if (project.value.isVat && choosesumVat.value === 'Vat นอก') {
    sumVat.value = true
  } else {
    sumVat.value = false
  }
};

async function createNewReceiptRefInvoice() {
  loading.value = true;
  const data = {
    invoiceId: refInvoice.value ? refInvoice.value.invoice : null,
    start_date: start_date.value || new Date(),
    amount_price: amount_price.value || 0,
    remark: remark.value || [],
    project: refInvoice.value.project,
    transfer: transfer.value,
    paid_detail: paid_detail.value,
    isSign: isSign.value,
    cur_period: cur_period.value
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

async function editReceiptRefInvoice(id) {
  loading.value = true;
  const data = {
    invoiceId: refInvoice.value ? refInvoice.value.invoice : null,
    start_date: start_date.value || new Date(),
    amount_price: amount_price.value || 0,
    remark: remark.value || [],
    transfer: transfer.value,
    //project: refInvoice.value ? refInvoice.value.project,
    paid_detail: paid_detail.value,
    isSign: isSign.value,
    cur_period: cur_period.value
  };
  console.log("data_refInv : ", data);
  try {
    const response = await Documents.editReceiptRefInvoice(id, data);
    if (response.status) {
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "แก้ไขใบเสร็จรับเงินแล้ว",
        life: 3000,
      });
    }
    console.log("res_receipt : ", response);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "เกิดข้อผิดพลาด !",
      detail: "ไม่สามารถแก้ไขใบเสร็จรับเงินได้",
      life: 3000,
    });
    console.log("error : ", error);
  } finally {
    loading.value = false;
    editReceiptRefInvoiceDialog.value = false;
    refresh();
  }
}
// -----------------------------

const closeHandle = () => {
  openFullReceipt.value = false;
  openSmallReceipt.value = false;
  const body = document.body;
  body.style.backgroundColor = "aliceblue";
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["Normal", "องค์กร", "หน่วยงานราชการ", "ลูกค้ารายเดือน", "VIP"]);

const percents = ref([1, 3, 5]);

const refresh = () => {
  loading.value = true
  Documents.getReceipts().then((data) => {
    originalReceipts.value = data.data.reverse()
    originalReceipts.value.forEach(re => {
      /* re.receipt = 
        re.isBillVat ? re.receiptVat
        : re.isBillVat === false ? re.receiptNoVat
        : re.receipt */

      re.vat.totalvat = 
        re.isVat && re.sumVat ? (re.project?.vat_price || 0) + totalVat(re)
        : re.isVat && !re.sumVat ? totalVat(re)
        : 0

      re.vat.total_deducted = 
        re.vat.percen_deducted ? (re.vat.percen_deducted/100)*re.amount_price
        : 0
      
      re.start_date_format = formatDateRef(re.start_date)
    })
    loading.value = false
  });

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
    product_head.value = refQuotation.value.product_head
    project.value = refQuotation.value.project,
    isWithholding.value = refQuotation.value.vat.percen_deducted ? true : false
    withholdingPercent.value = refQuotation.value.vat.percen_deducted
    company.value = selectedCompany.value;
    openProductForm.value = false;
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
    openProductForm.value = false;
    products.value = refQuotation.value.product_detail;
    discount.value = refQuotation.value.discount;
    project.value = refQuotation.value.project;
    selectedSignature.value = refQuotation.value.signature;
    bank.value = company.value.bank.find(
      (item) => item.number === refQuotation.value.bank.status
    );
    sumVat.value = refQuotation.value.sumVat;
    console.log("bank", bank.value);
    console.log("company", company.value);
  }
};

const seeFullReceipt = (data) => {
  console.log(customers.value)
  console.log(data.customer_detail)
  let customered = customers.value.find(
    (item) => item.customer_name.trim() === data.customer_detail.customer_name.trim()
  );

  if (!customered) {
    customered = data.customer_detail
  }

  console.log(customered)

  selectedReceipt.value = data;

  const company = cpStore.myCompanies.find(
    item => item.taxnumber === data.customer_branch.taxnumber
  )

  selectedReceipt.value.customer_branch.Branch_iden = company.Branch_iden
  selectedReceipt.value.customer_branch.Branch_company_name = company.Branch_company_name

  //selectedReceipt.value.customer_detail.tax_id = customered.customer_taxnumber

  openFullReceipt.value = true;
  //selectedReceipt.value.customer_detail.customer_address = customered.customer_position
  console.log("data", selectedReceipt.value);
  const body = document.body;
  body.style.backgroundColor = "white";
};

const seeSmallReceipt = (data) => {
  let customered = customers.value.find(
    (item) => item.customer_name === data.customer_detail.customer_name
  );
  if(!customered) {
    customered = data.customer_detail
  }

  openSmallReceipt.value = true;
  selectedReceipt.value = data;
  const company = cpStore.myCompanies.find(
    item => item.taxnumber === data.customer_branch.taxnumber
  )

  console.log(company)

  selectedReceipt.value.customer_branch.Branch_iden = company.Branch_iden
  selectedReceipt.value.customer_branch.Branch_company_name = company.Branch_company_name

  selectedReceipt.value.customer_detail.customer_address = customered.customer_position
  selectedReceipt.value.customer_detail.tax_id = customered.customer_taxnumber
  
  console.log("data", selectedReceipt.value);
  const body = document.body;
  body.style.backgroundColor = "white";
};

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

const formatDateRef = (isoDateString) => {
  let isoDate = new Date(isoDateString);

  // Convert to Buddhist Era (BE) by adding 543 years
  const thaiYear = isoDate.getUTCFullYear() + 543;

  // Get the day and month in UTC
  const day = String(isoDate.getUTCDate()).padStart(2, '0');
  const month = String(isoDate.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed

  // Format the date in "dd/mm/yyyy" format with the Thai year
  const formattedThaiDate = `${day}/${month}/${thaiYear}`;

  return formattedThaiDate;
};

const withholdingPrice = computed(() => {
  if (isWithholding.value && sumVat.value) {
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
    : product.value.product_price - (product.value.vat_price || 0)
  if (edittingProduct.value) {
    products.value[edittingProduct.value] = product.value
  } else {
    products.value.push(product.value);
  }
  console.log(product.value)
  edittingProduct.value = null
  product.value = {};
  product.value.product_logo64 = [];
  product.value.product_text = [""];
  openProductForm.value = false;
  uploadfiles.value.push(files.value)
  files.value = []
};

const allEnd = computed(() => {
  return netVat.value;
});

const editProduct = (item) => {
  if(!item) return
  edittingProduct.value = item
  console.log(item)
  product.value = item
  product.value.isVat = item.vat_price && item.vat_price > 0 ? true : false
  openProductForm.value = true
}

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
    const sumPrices = prices.reduce((a, b) => a + b, 0);
    return sumPrices;
  } else {
    return 0;
  }
});

const netPrices = computed(() => {
  if (receipt.value.isVat && sumVat.value) {
    return (sumProductsPrice.value+project.value.total) - discount.value;
  } else if (receipt.value.isVat && !sumVat.value){
    return (sumProductsPrice.value+project.value.total-project.value.vat_price) - discount.value;
  } else {
    return (sumProductsPrice.value+project.value.total) - discount.value;
  }
});

const vat = computed(() => {
  const all_vat = products.value.map(item=>{
    return (item.vat_price || 0)*item.product_amount
  })
  const result = discount.value > 0 
  ? (netPrices.value) * 0.07
  : all_vat.reduce((a,b) => a + b, 0 )
  
  return result
});

const netVat = computed(() => {
  if (receipt.value.isVat && sumVat.value) {
    const result = vat.value + netPrices.value + project.value.vat_price;
    return result;
  } else if (receipt.value.isVat && !sumVat.value){
    const result = vat.value + netPrices.value + project.value.vat_price;
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
  const formattedFile = await fileToBase64(file)
  product.value.product_logo.push(formattedFile)
  console.log(product.value.product_logo)
};

const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                resolve(blob);
            }, file.type);
        };

        img.onerror = (error) => {
            reject(error);
        };
    });
};

const fileToBase64 = async (file) => {
    const resizedBlob = await resizeImage(file, 200, 200); // Adjust max width and height as needed
    const reader = new FileReader();
    reader.readAsDataURL(resizedBlob);
    return new Promise((resolve, reject) => {
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
    });
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
  if (value !== undefined && value !== null) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return;
}

const resetData = () => {
  editReceiptRefInvoiceDialog.value = false
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
  paid_detail.value = ''
  isSign.value = false
};

const openNew = () => {
  resetData();
  submitted.value = false;
  receiptDialog.value = true;
  product.value.product_text = [""]
  discount.value = 0
};

const hideDialog = () => {
  editReceiptRefInvoiceDialog.value = false
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
  amount_price.value = receipt.value.amount_price
  console.log("re", receipt.value);
  isSign.value = prod.isSign
  project.value = receipt.value.project || {}
  start_date.value = prod.start_date;
  end_date.value = prod.end_date;

  const company = cpStore.myCompanies.find(
    (item) => item.taxnumber.trim() === prod.customer_branch.taxnumber.trim()
  );
  //console.log(cpStore.myCompanies)
  console.log(prod.customer_branch)
  selectedCompany.value = company;

  let customered = customers.value.find(
    (item) => item.customer_name === prod.customer_detail.customer_name
  );
  if (!customered) {
    customered = prod.customer_detail
  }
  selectedCustomer.value = customered;
  console.log('cus', selectedCustomer.value)
  refCustomer();
  console.log(prod.vat.percen_deducted)
  isWithholding.value = prod.vat.percen_deducted ? true : false;
  withholdingPercent.value = prod.vat.percen_deducted ? prod.vat.percen_deducted : null;
  discount.value = prod.discount;
  products.value = prod.product_detail;
  remark.value = prod.remark;
  bank.value = company
    ? company.bank.find((item) => item.number === prod.bank.status[0])
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
  transfer.value = receipt.value.transfer;
  referQuotation();
};

const edittingReceiptRefInvoice = (prod) => {
  resetData();
  receipt.value = prod
  paid_detail.value = prod.invoiceRef_detail.paid_detail
  editReceiptRefInvoiceDialog.value = true
};

const totalPrice = (product) => {
  const price = product.product_detail.map((item)=>{
    return (item.product_price*item.product_amount) - (item.vat_price || 0 *item.product_amount)
  })
  const all_price = price.length > 0 ? price.reduce((a,b) => a + b, 0) : 0
  return all_price
}

const totalVat = (product) => {
  const vat = product.product_detail.map((item)=>{
    return (item.vat_price || 0 )* item.product_amount
  })
  const result = vat.length > 0 ? vat.reduce((a,b) => a + b) : 0
  return result
}

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

const exportCSV = (event) => {
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
  //let img = [];
  //let qtId = null;
  products.value.forEach((product) => {
    product.product_logo64 = "";
  });
  console.log(start_date.value)
  const data = {
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
    },
    isSign: isSign.value,
    project: project.value,
    product_head: product_head.value,
    product_detail: products.value,
    amount_price: amount_price.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    bank: bank.value
      ? {
          name: bank.value ? bank.value.name : '',
          remark_2: bank.value ? bank.value.remark : '',
          status: bank.value ? bank.value.number : '',
        }
      : {
        name: "",
        remark_2: "",
        status: "",
    },
    isVat: selectedCompany.value ? selectedCompany.value.isVat : null,
    sumVat: sumVat.value,
    transfer: transfer.value
  };
  console.log(data.start_date);
  try {
    const response = await Documents.createNewReceipt(data);
    if (response.data) {
      //img = response.data.product_detail;
      //qtId = response.data._id;
      //const imgId = img.map((id) => id._id);
      /* if (imgId.length > 0 && qtId) {
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
      } */
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "สร้างใบเสร็จรับเงินแล้ว",
        life: 3000,
      });
      refresh();
    } 
  } catch (err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "มีบางอย่างผิดพลาด",
      detail: "สร้างใบเสร็จรับเงินล้มเหลว",
      life: 3000,
    });
  }
  finally {
    loading.value = false
    receiptDialog.value = false
    refresh()
  }
};

watch(start_date, (newVal, oldVal)=>{
  console.log('newVal', newVal)
  console.log('oldVal', oldVal)
})

const editingReceipt = async () => {
  loading.value = true;
  const data = {
    quotation: refQuotation.value ? refQuotation.value.quotation : null,
    customer_number: customer.value ? customer.value.customer_number : null,
    amount_price: amount_price.value,
    project: project.value,
    branchId: selectedCompany.value ? selectedCompany.value._id : null,
    signatureID: selectedSignature.value ? selectedSignature.value._id : "",
    customer_detail: {
      tax_id: customer.value ? customer.value.customer_taxnumber : null,
      customer_name: customer.value ? customer.value.customer_name : null,
      customer_lastname: customer.value ? customer.value.customer_lastname : null,
      customer_phone: customer.value ? customer.value.customer_phone : null,
      customer_email: customer.value ? customer.value.customer_email : null,
      customer_address: customer.value ? customer.value.customer_position : null,
      customer_type: customer.value ? customer.value.customer_type : null,
    },
    product_detail: products.value,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    sumVat: sumVat.value,
    isVat: selectedCompany.value ? selectedCompany.value.isVat : null,
    transfer: transfer.value,
    bank: bank.value
      ? {
          name: bank.value ? bank.value.name : '',
          remark_2: bank.value ? bank.value.remark : '',
          status: bank.value ? bank.value.number : '',
        }
      : {
          name: "",
          remark_2: "",
          status: "",
        },
  };
  console.log('editPayload', data)
  try {
    const response = await Documents.editReceipt(receipt.value?._id, data);
    if (response.data) {
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "แก้ไขใบเสร็จรับเงินแล้ว",
        life: 3000,
      });
    }
  } catch (err) {
    console.log(err);
    toast.add({
        severity: "error",
        summary: "error",
        detail: "แก้ไขใบเสร็จรับเงินล้มเหลว",
        life: 3000,
      });
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

const formatNumberToText = (number) => {
  const thaiNumerals = [
    "ศูนย์",
    "หนึ่ง",
    "สอง",
    "สาม",
    "สี่",
    "ห้า",
    "หก",
    "เจ็ด",
    "แปด",
    "เก้า",
  ];
  const thaiPlaces = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];

  const numArray = number.toString().split(".");
  const integerPart = numArray[0];
  const decimalPart = numArray[1] || "0";

  function convertIntegerToThaiText(num) {
    let result = "";
    let previousDigitWasZero = false;
    for (let i = 0; i < num.length; i++) {
      const digit = parseInt(num[i]);
      if (digit !== 0) {
        if (i === num.length - 2 && digit === 2 && !previousDigitWasZero) {
          // If in the tens position and digit is 2, and the previous digit is not zero
          result += "ยี่" + thaiPlaces[num.length - i - 1];
        } else {
          result += thaiNumerals[digit] + thaiPlaces[num.length - i - 1];
        }
        previousDigitWasZero = false;
      } else {
        previousDigitWasZero = true;
      }
    }
    return result;
  }

  function convertDecimalToThaiText(num) {
    if (parseInt(num) === 0) {
      return "";
    }
    let result = "";
    const tensDigit = parseInt(num[0]);
    const onesDigit = parseInt(num[1]);
    if (tensDigit !== 0) {
      if (tensDigit === 1) {
        result += "สิบ";
      } else if (tensDigit === 2) {
        result += "ยี่สิบ";
      } else {
        result += thaiNumerals[tensDigit] + "สิบ";
      }
    }
    if (onesDigit !== 0) {
      result += thaiNumerals[onesDigit];
    }
    return result;
  }

  const thaiIntegerText = convertIntegerToThaiText(integerPart);
  const thaiDecimalText = convertDecimalToThaiText(decimalPart);

  let thaiText = thaiIntegerText + (thaiIntegerText !== "" ? "บาท" : "");

  if (decimalPart !== "0") {
    thaiText += thaiDecimalText + "สตางค์";
  }

  return thaiText || "ศูนย์บาท";
};

const calVat = (pd) => {
  if (!pd) return
  const vat_list = pd.map(i=>{
    return (i.vat_price || 0)*i.product_amount
  })
  const result = vat_list.reduce((a,b)=>a+b,0)
  return result
}

</script>
