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
              :disabled="!selectedSuppliers || !selectedSuppliers.length"
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
          :value="suppliers"
          v-model:selection="selectedSuppliers"
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
              <p class="m-0">ซัพพลายเออร์ <span class="mx-5 font-bold text-green-700">{{ suppliers?.length }}</span></p>
              <span class="p-input-icon-right border rounded">
                <i class="pi pi-search" />
                <InputText v-model="filters['global'].value" class="px-3" placeholder="ค้นหาร้านค้า..." />
              </span>
            </div>
          </template>
  
          <template #empty>
            <div class="w-full flex justify-center items-center py-48 border-t border-b">
              <p class="tex-lg">ไม่มีข้อมูล</p>
            </div>
          </template>
  
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column field="supplier_company_name" header="ชื่อร้านค้า" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              <div>
                <p>{{ slotProps.data.supplier_company_name }}</p>
                <small>{{ slotProps.data.supplier_company_number !== 'ไม่มี' ? slotProps.data.supplier_company_number : null }}</small>
              </div>
            </template>
          </Column>
          <Column
            field="supplier_tel"
            header="เบอร์โทรติดต่อ"
            sortable
            class="border-b"
            style="min-width: 8rem"
          ></Column>
          <Column
            field="'supplier_company_address'"
            header="ที่อยู่ร้านค้า"
            sortable
            class="border-b"
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              {{ slotProps.data.supplier_company_address !== 'ไม่มี' ? slotProps.data.supplier_company_address : null }}
              <div class="w-1/2 flex items-center gap-2">
                <i class="pi pi-map-marker text-red-500"></i>
                <a v-if="slotProps.data.supplier_type" :href="slotProps.data.supplier_type" target="_blank" class="overflow-hidden hover:bg-green-100 rounded w-1/2 text-sm hover:w-full cursor-pointer">{{ slotProps.data.supplier_type }}</a>
                <small v-else>-</small>
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
                @click="seeSupplier(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="text-yellow-500"
                @click="editSupplier(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                class="text-red-500"
                @click="confirmDeleteSupplier(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>
  
      <Dialog
        v-model:visible="supplierDialog"
        :style="{ width: '450px' }"
        header="เพิ่มซัพพลายเออร์"
        :modal="true"
        class="p-fluid"
      >
        <div class="card flex flex-col gap-y-4">
          <div class="field">
            <label for="supplier_company_name">
              ชื่อร้านค้า 
              <small class="p-error" v-if="!supplier.supplier_company_name">
                *กรุณาเพิ่มชื่อร้านค้า
              </small>
            </label>
            <InputText
              class="p-2 ring-1"
              id="supplier_company_name"
              v-model="supplier.supplier_company_name"
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
              v-model.trim="supplier.supplier_company_number"
              required="true"
              placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
              autofocus
            />
            <small class="p-error" v-if="submitted && !supplier.supplier_company_number"
              >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
            >
          </div>
          <div class="field">
            <label>
              เบอร์ติดต่อร้านค้า
            </label>
            <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="supplier.supplier_tel" required="false" />
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
            @click="createNewSupplier"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="supplierEditDialog"
        :style="{ width: '450px' }"
        header="แก้ไขข้อมูลซัพพลายเออร์"
        :modal="true"
        class="p-fluid"
      >
        <div class="card flex flex-col gap-y-4">
          <div class="field">
            <label for="supplier_company_name">
              ชื่อร้านค้า 
              <small class="p-error" v-if="!supplier.supplier_company_name">
                *กรุณาเพิ่มชื่อร้านค้า
              </small>
            </label>
            <InputText
              class="p-2 ring-1"
              id="supplier_company_name"
              v-model="supplier.supplier_company_name"
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
              v-model.trim="supplier.supplier_company_number"
              required="true"
              placeholder="เลขประจำตัวผู้เสีภาษี หรือ รหัสประชาชน 13 หลัก"
              autofocus
            />
            <small class="p-error" v-if="submitted && !supplier.supplier_company_number"
              >กรุณาเพิ่มเลขประจำตัวผู้เสียภาษี หรือรหัสประชาชนลูกค้า</small
            >
          </div>
          <div class="field">
            <label>
              เบอร์ติดต่อร้านค้า
            </label>
            <InputMask id="basic" mask="099-999-9999" placeholder="0xx-xxx-xxxx" class="p-2 ring-1" v-model.trim="supplier.supplier_tel" required="false" />
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
        v-model:visible="deleteSupplierDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="supplier.supplier_company_name"
            >คุณแน่ใจว่าต้องการลบร้านค้ารายนี้หรือไม่ ?<b>{{ supplier.supplier_company_name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            class="py-3"
            label="ยกเลิก"
            icon="pi pi-times"
            text
            @click="deleteSupplierDialog = false"
          />
          <Button
            class="py-3"
            label="ยืนยัน"
            icon="pi pi-check"
            text
            @click="deleteSupplier"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="deleteSuppliersDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="supplier">คุณแน่ใจว่าต้องการลบร้านค้ารายนี้หรือไม่ ?</span>
        </div>
        <template #footer>
          <Button
            label="ยกเลิก"
            icon="pi pi-times"
            text
            @click="deleteSuppliersDialog = false"
          />
          <Button label="ยืนยัน" icon="pi pi-check" text @click="deleteSelectedSuppliers" />
        </template>
      </Dialog>

      <Dialog v-model:visible="openSupplier" modal :header="selectedSupplier?.supplier_company_name" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <div class="flex flex-col gap-y-2">
          <span><strong>ชื่อร้านค้า : </strong>{{ selectedSupplier?.supplier_company_name }} 
          </span>
          <span><strong>เลขประจำตัวผู้เสียภาษี : </strong>{{ selectedSupplier?.supplier_company_number || '-' }}</span>
          <span><strong>ที่อยู่ : </strong>{{ selectedSupplier?.supplier_company_address }}</span>
          <a :href="selectedSupplier?.supplier_type" target="_blank" class="cursor-pointer hover:text-bold hover:text-orange-400 duration-300 ease-in-out"><i class="pi pi-map-marker pr-3 text-red-500"></i>{{ selectedSupplier?.supplier_type }}</a>
          <span><strong>เบอร์โทร : </strong>{{ selectedSupplier?.supplier_tel }}</span>
          <div>
            <p class="font-bold">ประวัติการสั่งซื้อ</p>
            <div class="grid grid-cols-12">
              <div class="col-span-full border grid grid-cols-12">
                <div class="border-r col-span-2">
                  <p class="text-center">ลำดับ/เลขที่บิล</p>
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
                <div v-if="selectedBill.length < 1" class="col-span-full flex items-center justify-center">
                  <p class="text-center">ไม่มีรายการ</p>
                </div>
                <div class="col-span-full border grid grid-cols-12" v-else v-for="(bill, billIndex) in selectedBill" :key="bill._id">
                  <div class="border-r col-span-2 min-h-10 h-auto flex justify-center items-center">
                    <p class="text-center">{{ billIndex + 1 }}{{ bill.code ? `/${bill.code}` : null }}</p>
                  </div>
                  <div class="border-r col-span-4 min-h-10 h-auto flex flex-col justify-center items-center">
                    <div v-for="(product, productIndex) in bill.product_detail" class="text-start">
                      <p>
                        <span class="font-bold">{{ product.product_name }}</span>
                        <span class="px-3 text-sm">({{ product.product_price }} x {{ product.product_amount }}{{ product.unit }})</span>
                        <span class="font-bold">{{ formatCurrency(product.product_total) }}</span>
                        <span class="px-3">{{ product.product_cost_type ? `(${product.product_cost_type})` : null }}</span>
                      </p>
                    </div>
                  </div>
                  <div class="border-r col-span-2 min-h-10 h-auto flex justify-center items-center">
                    <p class="text-center">{{ formatCurrency(bill.net) }}</p>
                  </div>
                  <div class="border-r col-span-2 min-h-10 h-auto flex justify-center items-center">
                    <p class="text-center">{{ formatThaiDate(bill.date) }}</p>
                  </div>
                  <div class="col-span-2 min-h-10 h-auto flex justify-center items-center">
                    <Image v-if="bill.bill_img" :src="bill.bill_img" :alt="'bill-'+billIndex" width="40" preview />
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
  import { formatThaiDate } from "@/functions/DateTime";
  import { formatCurrency } from "@/functions/Currency";
  import axios from 'axios';
  
  onMounted(async () => {
    Suppliers.getSuppliers().then((data) => (suppliers.value = data.data));
  });
  
  const isMain = ref(false)
  const openSupplier = ref(false);
  const loading = ref(false);
  const supplierEditDialog = ref(false);
  const lastRefreshed = ref()
  const toast = useToast();
  const dt = ref();
  const supplier = ref({});
  const suppliers = ref();
  const selectedSupplier = ref();
  const supplierDialog = ref(false);
  const deleteSupplierDialog = ref(false);
  const deleteSuppliersDialog = ref(false);
  const selectedSuppliers = ref();
  const uploadfiles = ref([]);
  const selectedBill = ref([]);
  const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const submitted = ref(false);
  const supplierTypes = ref(["ทั่วไป", "องค์กร", "หน่วยงานราชการ", "VIP"]);
  
  const refreshData = () => {
    Suppliers.getSuppliers().then((data) => (suppliers.value = data.data));
    const currentTimestamp = Date.now();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(currentTimestamp));
    lastRefreshed.value = formattedTime
  };
  
  const seeSupplier = (data) => {
    openSupplier.value = true;
    selectedSupplier.value = data;
    getBills()
    console.log("data", selectedSupplier.value);
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
  
  const openNew = () => {
    supplier.value = {};
    submitted.value = false;
    supplierDialog.value = true;
  };

  const hideDialog = () => {
    supplier.value = {};
    supplierDialog.value = false;
    supplierEditDialog.value = false;
    submitted.value = false;
  };
  
  const editSupplier = (prod) => {
    supplier.value = { ...prod };
    supplierEditDialog.value = true;
  };

  const confirmDeleteSupplier = (prod) => {
    supplier.value = prod;
    deleteSupplierDialog.value = true;
  };
  const deleteSupplier = async () => {
    const suppliers_to_delete = supplier.value;
    if (suppliers_to_delete) {
      console.log(suppliers_to_delete._id);
      await Suppliers.deleteSupplier(suppliers_to_delete._id);
    }
    await Suppliers.getSuppliers().then((data) => (suppliers.value = data.data));
    deleteSupplierDialog.value = false;
    supplier.value = {};
    toast.add({
      severity: "success",
      summary: "Successful",
      detail: "ลบร้านค้าแล้ว",
      life: 3000,
    });
  };
  
  const exportCSV = () => {
    dt.value.exportCSV();
  };
  const confirmDeleteSelected = () => {
    deleteSuppliersDialog.value = true;
  };
  
  const deleteSelectedSuppliers = async () => {
    const suppliers_to_delete = suppliers.value.filter(
      (val) => !selectedSuppliers.value.includes(val)
    );
    console.log(selectedSuppliers.value.length);
    console.log(suppliers_to_delete.length);
    if (
        suppliers_to_delete.length > 0 
    ) {
      for (let ct of selectedSuppliers.value) {
        console.log(sp._id);
        await Suppliers.deleteSupplier(sp._id);
      }
    }
    await Suppliers.getSuppliers().then((data) => (suppliers.value = data.data));
      deleteSuppliersDialog.value = false;
      selectedSuppliers.value = null;
      toast.add({
        severity: "success",
        summary: "Successful",
        detail: "ลบร้านค้าแล้ว",
        life: 3000,
      });
  };
  
  const createNewSupplier = async () => {
    loading.value = true;
    const data = {
        supplier_tel: supplier.value.supplier_tel,
        supplier_company_name: supplier.value.supplier_company_name,
        supplier_company_number: supplier.value.supplier_company_number,
        supplier_company_address: supplier.value.supplier_company_address,
        supplier_type : supplier.value.supplier_type,
    }
    try {
        const response = await Suppliers.createNewSupplier(data);
        if (response.status) {
          toast.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "เพิ่มร้านค้าใหม่แล้ว",
              life: 3000,
          });
          supplierEditDialog.value = false;
          refreshData()
        }
    }
    catch (err) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "เพิ่มร้านค้าใหม่ล้มเหลว",
            life: 3000,
        });
    }
    finally {
        loading.value = false
        refreshData()
    }
  }
  
  const editingSupplier = async () => {
    loading.value = true;
    const id = supplier.value._id
    const data = {
        supplier_tel: supplier.value.supplier_tel,
        supplier_company_name: supplier.value.supplier_company_name,
        supplier_company_number: supplier.value.supplier_company_number,
        supplier_company_address: supplier.value.supplier_company_address,
        supplier_type : supplier.value.supplier_type,
    }
    try {
        const response = await Suppliers.editSupplier(id, data);
        if (response.status) {
          toast.add({
              severity: "success",
              summary: "สำเร็จ",
              detail: "เแก้ไขร้านค้าใหม่แล้ว",
              life: 3000,
          });
          supplier.value = {}
          supplierEditDialog.value = false;
          refreshData()
        }
    }
    catch (err) {
        console.log(err)
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "แก้ไขร้านค้าล้มเหลว",
            life: 3000,
        });
    }
    finally {
        loading.value = false
        refreshData()
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

  const getBills = async () => {
    loading.value = true;
    const supName = selectedSupplier.value.supplier_company_name;
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/PurchaseOrderSupllier/getBySup/${supName}`,
        {
          headers: {
            'auth-token' : localStorage.getItem("ssgdToken")
          }
        }
      )
      console.log(data.data)
      if (data.status) {
        console.log(data.data)
        selectedBill.value = data.data
      }
    }
    catch (err) {
      console.log(err)
    }
    finally {
      loading.value = false;
    };
  }
  </script>
  