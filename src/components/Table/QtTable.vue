<template>
  <Toast />
  <ConfirmDialog></ConfirmDialog>
  <div class="h-full">
    <div
      class="shadow-none rounded-none p-0 min-h-full cursor-pointer absolute top-0 left-0 bg-white w-full"
      v-if="openQuotation"
    >
      <DocQuotation
        :color="color"
        :data="selectedQuotation"
        :isSign="sign"
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
        :rows="5"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="แสดง {first} ถึง {last} จากเอกสารทั้งหมด {totalRecords} ชุด"
        :pt="{
          header: { style: `backgroundColor: #${color}` },
        }"
      >
        <template #header>
          <div class="flex flex-wrap gap-2 items-center justify-between">
            <h4 class="m-0">จัดการเอกสาร</h4>
            <span class="p-input-icon-right border rounded">
              <i class="pi pi-search" />
              <InputText v-model="filters['global'].value" placeholder="" />
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

        <Column selectionMode="multiple" style="width: 2rem" :exportable="false"></Column>
        <Column
          field="quotation"
          header="เลขที่"
          sortable
          style="max-width: 10rem"
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
          :style="{maxWidth: '12rem'}"
          class="border-b"
        >
          <template #body="slotProps">
            <div class="flex flex-col text-xs h-[3rem] overflow-y-auto"
            >
              <p>{{ slotProps.data.customer_detail?.customer_name }} </p>
              <p>{{ 
                slotProps.data.customer_detail?.customer_lastname&&slotProps.data.customer_detail?.customer_lastname!=='undefined' 
                ? `(${slotProps.data.customer_detail?.customer_lastname})` 
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
          style="max-width: 7rem"
        >
          <template #body="slotProps">
            <p class="text-xs">{{ formatDateRef(slotProps.data.start_date) }}</p>
          </template>
        </Column>
        <Column
          field="end_date"
          header="วันที่สิ้นสุด"
          class="border-b"
          sortable
          style="max-width: 7rem"
        >
          <template #body="slotProps">
            <p class="text-xs">{{ formatDateRef(slotProps.data.end_date) }}</p>
          </template>
        </Column>

        <Column
          field="total"
          class="border-b"
          header="ราคา"
          sortable
          style="max-width: 7rem"
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
          field="sumVat"
          header="VAT 7%"
          sortable
          style="max-width: 6rem"
          class="border-b"
        >
          <template #body="slotProps">
            <div class="grid place-items-center w-full">
              <span class="text-sm text-center" 
              :class="slotProps.data.customer_branch.isVat 
              ? 'bg-yellow-200 rounded p-1' : ''">
                {{ 
                  slotProps.data.customer_branch.isVat && slotProps.data.sumVat ? "VAT" 
                  : slotProps.data.customer_branch.isVat && !slotProps.data.sumVat ? "VAT"
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
          style="max-width: 9rem"
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
          field="status"
          class="border-b text-xs text-center"
          header="ออกใบแจ้งหนี้"
          sortable
          style="max-width: 7rem"
        >
          <template #body="slotProps">
            <p
              :class="[
                slotProps.data.status === 'invoiced' ? 'text-blue-500' 
                : slotProps.data.status === 'rejected' ? 'text-red-500' 
                : 'hidden'
              ]"
            >
              {{ 
                slotProps.data.status === 'invoiced' ? 'ออกใบแจ้งหนี้แล้ว' 
                : slotProps.data.status === 'rejected' ? 'ยกเลิก' 
                : ''
              }}
            </p>
            <Button 
              v-if="!['invoiced', 'rejected', 'accepted'].includes(slotProps.data.status)"
              :label="!loading ? 'อัพเดท' : ''"
              :loading="loading"
              @click="openUpdateStatus = true"
              class="bg-orange-500 text-white px-2 py-1 hidden"
            />
            <Button 
              v-if="!['invoiced', 'rejected', 'accepted'].includes(slotProps.data.status)"
              :label="!loading ? 'ออกใบแจ้งหนี้' : ''"
              :loading="loading"
              @click="exportInvoice(slotProps.data)"
              class="bg-blue-500 text-white px-2 py-1"
            />
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
      <!-- <span class="my-4" v-if="selectedCompany?.isVat">
        <InputSwitch v-model="sumVat" /> <span>{{ !sumVat ? 'Vat ใน' : 'Vat นอก' }}</span>
      </span> -->
      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="prod.project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="prod.project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>
      
      <br />

      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <InputText v-model="prod.project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <InputNumber v-model="prod.project.amount" inputId="integeronly" />
                <InputText v-model="prod.project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <InputNumber v-model="prod.project.price" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" />
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

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0">
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
        <p v-if="prod.project.isVat">
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
        <p v-if="prod.project.isVat">
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
      <div v-if="selectedCompany?.isVat"  class="flex justify-between bg-slate-200 px-3 py-2">
        <div class="flex items-center">
          <Checkbox v-model="prod.project.isVat" inputId="headIsVat" name="isVat" :binary="true" />
          <label for="isVat" class="ml-2"> VAT 7% </label>
        </div>
        <SelectButton class="w-1/2" @change="changesumVat()" v-show="prod.project.isVat" v-model="choosesumVat" :options="['Vat ใน', 'Vat นอก']" aria-labelledby="basic" />
      </div>
      <br />
      <div class="card">
        <div class="bg-slate-200 px-2 py-5 rounded shadow-md">
          <div>
            <div>
              <p class="font-bold">ชื่อโครงการ (Project)</p>
              <InputText v-model="prod.project.name" class="px-2" />
            </div>
            <div>
              <p>จำนวน</p>
              <div class="flex gap-2">
                <InputNumber v-model="prod.project.amount" inputId="integeronly" />
                <InputText v-model="prod.project.unit" class="text-center" placeholder="หน่วย" />
              </div>
            </div>
            <div>
              <p>ราคา/หน่วย</p>
              <InputNumber v-model="prod.project.price" inputId="locale-user" :minFractionDigits="2" :maxFractionDigits="2" />
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

            <div class="py-2" v-if="prod.project.isVat && prod.project.vat_price!==0">
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
                          <span class="text-orange-500" :class="item.product_name ? 'font-bold bg-orange-200 px-5' : ''">{{ item.product_name ? item.product_no : null }}</span> 
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
                      <Image :src="`${pic}`" alt="Image" class="h-[100px] flex items-center" width="100" preview />
                      <i @click="product?.product_logo?.splice(picindex, 1)" class="pi pi-times" style="color: red"></i>
                    </div>
                  </div>
                </template>
            </FileUpload>
          </div>
        </div>
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
        <p v-if="prod.project.isVat">
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
        <p v-if="prod.project.isVat">
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
        <Button label="ยกเลิก" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="บันทึก"
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

    <Dialog v-model:visible="openUpdateStatus" modal header=" " :style="{ width: '25rem' }">
      <div class="flex gap-4 justify-center">
        <Button @click="confirm2()" label="ยกเลิกงาน" class="text-white bg-red-500 px-2 py-1" outlined></Button>
        <Button @click="confirm1()" label="ได้งาน" class="bg-green-500 text-white px-2 py-1"></Button>
      </div>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { Documents } from "@/service/ProductService";
import { Customers } from "@/service/Customer";
import { useQuotationStore } from "@/stores/quotation";
import { useCompanyStore } from "@/stores/company";
import DocQuotation from "@/components/Pdf/DocQuotation.vue";
import { copyToClipboard } from "@/functions/Coppy"
import axios from 'axios';
import { useConfirm } from "primevue/useconfirm";

const confirm = useConfirm();

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
};

const prod = ref({
  project: {},
  product_detail: []
});
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
const subProduct = ref({});
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
const transfer = ref('bank')
const sign = ref(false)

const choosesumVat = ref('Vat นอก');

watch(() => prod.value.project.isVat, (newValue, oldValue) => {
  if(!newValue) {
    prod.value.project.vat_price = 0
  }
})

const changesumVat = () => {
  if (prod.value.project.isVat && choosesumVat.value === 'Vat นอก') {
    sumVat.value = true
  } else {
    sumVat.value = false
  }
};

const pushProduct = () => {
  prod.value.product_detail.push({})
};

const spliceProduct = (index) => {
  prod.value.product_detail.splice(index, 1)
};

const uploadProductPicture = async () => {
  loading.value = true
  const data = tempPictures.value
  try {
    const { data } = await axios.put(
      `${import.meta.env.VITE_API_URL}/...`,
      data,
      {
        headers: {
          'auth-token': import.meta.env.VITE_TOKEN
        }
      }
    )
  }
  catch (e) {
    console.log(e)
  }
  finally {
    loading.value = false
  }
};

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
  //product.value.product_logo64 = item.product_logo64 ? item.product_logo64 : []
  product.value.product_logo = item.product_logo
  product.value.isVat = item.vat_price && item.vat_price > 0 ? true : false
  openProductForm.value = true
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["Normal", "องค์กร", "หน่วยงานราชการ", "ลูกค้ารายเดือน", "VIP"]);

const percents = ref([3, 5]);

const refresh = () => {
  loading.value = true
  Documents.getQuotations().then( data => {
    quotations.value = data.data.reverse()
    loading.value = false
  });

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

  const company = cpStore.myCompanies.find(
    item => item.taxnumber === data.customer_branch.taxnumber
  )

  const customered = customers.value.find(
    item => item.customer_name === data.customer_detail?.customer_name
  );
  selectedQuotation.value.customer_detail.tax_id = customered.customer_taxnumber

  selectedQuotation.value.customer_branch.Branch_iden = company.Branch_iden
  selectedQuotation.value.customer_branch.Branch_company_name = company.Branch_company_name

  console.log("data", selectedQuotation.value);
  const body = document.body;
  body.style.backgroundColor = 'white';
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
    const result = ((netPrices.value) * withholdingPercent.value ) / 100;
    return result;
  } else if (isWithholding.value && !sumVat.value) {
    const result = ((netPrices.value) * withholdingPercent.value ) / 100;
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
  return netVat.value
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
  if (prod.value.project.isVat && sumVat.value) {
    const result = vat.value + netPrices.value + prod.value.project.vat_price;
    return result;
  } else if (prod.value.project.isVat && !sumVat.value){
    const result = vat.value + netPrices.value + prod.value.project.vat_price;
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
  isWithholding.value = false;
}

const openNew = () => {
  resetData()
  submitted.value = false;
  quotationDialog.value = true;
  product.value.product_text = [""];
};

const isPrice = ref(true);

const hideDialog = () => {
  product.value = {};
  products.value = [];
  customer.value = {};
  quotationDialog.value = false;
  quotationEditDialog.value = false;
  submitted.value = false;
};

const emits = defineEmits(["referQt"])

const exportInvoice = (data) => {
  emits('referQt', data)
}

const editQuotation = (prodd) => {
  quotation.value = { ...prodd };
  console.log("qt", quotation.value);

  start_date.value = prodd.start_date;
  end_date.value = prodd.end_date;

  const company = cpStore.myCompanies.find(
    item => item.taxnumber === prodd.customer_branch.taxnumber
  );
  selectedCompany.value = company;
  console.log(company)
  console.log(prodd.customer_branch.taxnumber)
  const customered = customers.value.find(
    (item) => item.customer_name === prodd.customer_detail?.customer_name
  );
  selectedCustomer.value = customered;
  refCustomer();

  isWithholding.value = prodd.vat.percen_deducted ? true : false;
  withholdingPercent.value = prodd.vat.percen_deducted ? prodd.vat.percen_deducted : null;
  discount.value = prodd.discount;
  products.value = prodd.product_detail;
  remark.value = prodd.remark;
  bank.value = prodd.bank ? company?.bank?.find((item) => item.number === prodd.bank?.status) : null;
  selectedSignature.value = cpStore.mySignatures.find((item) => item.name === prodd.signature.name);
  product_head.value = prodd.product_head || ''
  prod.value.project = prodd.project
  quotationEditDialog.value = true
  product.value = {}
  product.value.product_text = [""]
  sumVat.value = prodd.sumVat
  transfer.value = prodd.transfer || 'cash'
};

const totalPrice = (product) => {
  const price = product.product_detail.map((item)=>{
    return item.product_total - (item.vat_price || 0)
  })
  const all_price = price.length > 0 ? price.reduce((a,b) => a + b) : 0
  return all_price
}

const totalVat = (product) => {
  const vat = product.product_detail.map((item)=>{
    return (item.vat_price || 0)*item.product_amount
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

const isAmount = ref(true)

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
  let product_pics = [];

  /*  products.value.forEach((product) => {
    product_pics.push()
    product.product_logo = []
  }); */

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
    project: prod.value.project,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    bank: transfer.value === 'bank' ? {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    } : {
      name: '',
      remark_2: '',
      status: '',
    },
    isVat: selectedCompany.value.isVat,
    sumVat: sumVat.value,
    transfer: transfer.value
  };
  console.log(data);

  let product_detail = [];
  let qtId = null;

  try {
    const response = await Documents.createNewQuotation(data);
    if (response.data.data) {
      product_detail = [...response.data.product_detail];
      qtId = response.data._id;
      const imgId = product_detail.map((id) => id._id);
      if (imgId && imgId.length > 0) {
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
          severity: "info",
          summary: "สร้างใบเสนอราคาแล้ว",
          detail: "ไม่มีสินค้าในใบเสนอราคา",
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
      detail: "สร้างใบเสนอราคาล้มเหลว",
      life: 3000,
    })
  }
  finally {
    quotationDialog.value = false;
    loading.value = false;
    prod.value.project = {};
    refresh();
  }
}

const editingProductQuotation = async () => {
  loading.value = true;
  const data = {
    product_detail: products.value
  }
  try {
    const response = await Documents.editProductQuotation(quotation.value._id, data);
    if (response.data) {
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "อัพเดทใบเสนอราคาแล้ว",
        life: 3000,
      });
    } 
  } 
  catch(err) {
    console.log(err);
  }
  finally {
    loading.value = false;
    quotationEditDialog.value = false;
    refresh()
  }
};

const editingQuotation = async () => {
  loading.value = true;
  console.log(customer.value)
  console.log(selectedCompany.value)
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
    project: prod.value.project,
    discount: discount.value,
    percen_deducted: isWithholding.value ? withholdingPercent.value : null,
    percen_payment: isWithholding.value ? withholdingPercent.value : null,
    start_date: start_date.value,
    end_date: end_date.value,
    remark: remark.value,
    isVat: selectedCompany.value.isVat,
    sumVat: sumVat.value,
    bank: bank.value && transfer.value === 'bank' ? {
      name: bank.value.name,
      remark_2: bank.value.remark,
      status: bank.value.number,
    } : {
      name: '',
      remark_2: '',
      status: '',
    },
    transfer: transfer.value
  };
  console.log(data)
  try {
    const response = await Documents.editQuotation(quotation.value._id, data);
    if (response.data) {
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "อัพเดทใบเสนอราคาแล้ว",
        life: 3000,
      });
      //await editingProductQuotation()
    } 
  } 
  catch(err) {
    console.log(err);
    toast.add({
      severity: "error",
      summary: "ERROR",
      detail: "อัพเดทใบเสนอราคาล้มเหลว",
      life: 3000,
    });
  }
  finally {
    loading.value = false;
    quotationEditDialog.value = false;
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

// uploadpictures
const customBase64Uploader = async (event) => {
  const file = event.files[0];
  const formattedFile = await fileToBase64(file)
  product.value.product_logo.push(formattedFile)
  console.log(product.value.product_logo)
};

const uploadPicture = async () => {
    loading.value = true
    try {
      const id = picture.value._id
      const pictureData = picture.value.file
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/upload-pic-purchase/${id}`,
        {
          bill_img: pictureData
        },
        {
          headers: {
            'auth-token' : import.meta.env.VITE_TOKEN
          }
        }
      )
      if (response.data.status) {
        toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "อัพโหลดรูปภาพแล้ว",
            life: 3000,
        })
        picture.value = {}
        refreshData()
      }
    }
    catch (err) {
      console.log(err)
      toast.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: "อัพโหลดรูปภาพล้มเหลว",
            life: 3000,
        })
    }
    finally {
      loading.value = false
    }
  }

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

// Function to convert a file to Base64
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

const openUpdateStatus = ref(false);
const confirm1 = () => {
    confirm.require({
        message: 'ยืนยันใบเสนอราคานี้ ?',
        header: ' ',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'text-black',
        rejectLabel: 'ยกเลิก',
        acceptLabel: 'ยืนยัน',
        acceptClass: 'text-green-700',
        accept: () => {
            openUpdateStatus.value = false
            toast.add({ severity: 'success', summary: 'ยืนยันแล้ว', detail: 'ยืนยันใบเสนอราคาแล้ว', life: 3000 });
        },
        reject: () => {
            openUpdateStatus.value = false
        }
    });
};

const confirm2 = () => {
    confirm.require({
        message: 'ยกเลิกใบเสนอราคานี้ ?',
        header: ' ',
        icon: 'pi pi-info-circle',
        rejectLabel: 'ยกเลิก',
        acceptLabel: 'ยืนยัน',
        rejectClass: 'p-button-secondary p-button-outlined',
        acceptClass: 'p-button-danger',
        accept: () => {
            openUpdateStatus.value = false
            toast.add({ severity: 'success', summary: 'ยกเลิกแล้ว', detail: 'ยกเลิกใบเสนอราคาแล้ว', life: 3000 });
        },
        reject: () => {
            openUpdateStatus.value = false
        }
    });
};

</script>
