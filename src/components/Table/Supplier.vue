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
              :disabled="!selectedCustomers || !selectedCustomers.length"
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
            <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
              <h4 class="m-0"></h4>
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
            field="supplier_number"
            header="รหัสร้านค้า"
            sortable
            style="min-width: 12rem"
            class="border-b"
          ></Column>
          <Column field="supplier_company_name" header="ชื่อร้านค้า" sortable style="min-width: 16rem" class="border-b">
            <template #body="slotProps">
              {{ slotProps.data.supplier_company_name }}
            </template>
          </Column>
          <Column
            field="customer_type"
            header="ประเภทร้านค้า"
            sortable
            class="border-b"
            style="min-width: 8rem"
          ></Column>
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
        header="Supplier Details"
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
          <div class="field">
            <label for="supplier_taxnumber">ชื่อร้านค้า</label>
            <InputText
              class="p-2"
              id="supplier_taxnumber"
              v-model="supplier.supplier_name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !supplier.supplier_name }"
            />
            <small class="p-error" v-if="submitted && !supplier.supplier_name"
              >กรุณาเพิ่มชื่อร้านค้า</small
            >
          </div>
          <div class="field">
            <label for="supplier_lastname">สำนักงานใหญ่/สาขา</label>
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
            <label for="supplier_tel">เบอร์ติดต่อร้านค้า</label>
            <InputText
              class="p-2"
              id="supplier_tel"
              v-model.trim="supplier.supplier_tel"
              required="false"
              autofocus
              :class="{ 'p-invalid': submitted && !supplier.supplier_tel }"
            />
            <small class="p-error" v-if="submitted && !supplier.supplier_tel"
              >เบอร์ติดต่อร้านค้า</small
            >
          </div>
          <div class="field">
            <label for="supplier_company_address">ที่อยู่ร้านค้า</label>
            <InputText
              class="p-2"
              id="supplier_company_address"
              v-model.trim="supplier.supplier_company_address"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !supplier.supplier_company_address }"
            />
          </div>
          
          <div class="field">
            <div>
              <label for="inventoryStatus" class="mb-3">ประเภทร้านค้า</label>
              <Dropdown
                id="inventoryStatus"
                v-model.trim="supplier.supplier_type"
                :options="supplierTypes"
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
            @click="createNewCustomer"
          />
        </template>
      </Dialog>
  
      <Dialog
        v-model:visible="customerEditDialog"
        :style="{ width: '450px' }"
        header="Customer Details"
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
          <div class="field">
            <label for="customer_taxnumber">ชื่อลูกค้า</label>
            <InputText
              class="p-2"
              id="customer_taxnumber"
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
            <div>
              <p>สำนักงานใหญ่/สาขา</p>
              <InputSwitch @change="changeMain" v-model="isMain" />
            </div>
            <InputText
              class="p-2"
              v-model.trim="customer.customer_lastname"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !customer.customer_lastname }"
            />
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
              <label class="mb-3">ประเภทร้านค้า</label>
              <Dropdown
                id="inventoryStatus"
                v-model.trim="supplier.supplier_type"
                :options="supplierTypes"
                placeholder="เลือกประเภทร้านค้า"
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
          <span><strong>ชื่อลูกค้า : </strong>{{ selectedSupplier?.supplier_company_name }} 
          </span>
          <span><strong>เลขประจำตัวผู้เสียภาษี TAX ID : </strong>{{ selectedSupplier?.supplier_iden_number }}</span>
          <span><strong>ที่อยู่ : </strong>{{ selectedSupplier?.supplier_company_address }}</span>
          <span><strong>ประเภทร้านค้า : </strong>{{ selectedSupplier?.supplier_type }}</span>
          <span><strong>เบอร์โทร : </strong>{{ selectedSupplier?.supplier_company_number }}</span>
        </div>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { FilterMatchMode } from "primevue/api";
  import { useToast } from "primevue/usetoast";
  import { Suppliers } from "@/service/Supplier";
  
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
        await Suppliers.deleteCustomer(sp._id);
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
        supplier_status: supplier.value.supplier_status,
        supplier_company_name: supplier.value.supplier_company_name,
        supplier_company_number: supplier.value.supplier_company_number,
        supplier_company_address: supplier.value.supplier_company_address,
        supplier_type : supplier.value.supplier_type,
        remark : supplier.value.supplier_remark
    }
    try {
        const response = await Suppliers.createNewSupplier(data);
        if (response.data) {
        toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "เพิ่มร้านค้าใหม่แล้ว",
            life: 3000,
        });
        supplierEditDialog.value = false;
        refreshData()
        } else {
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "เพิ่มร้านค้าใหม่ล้มเหลว",
            life: 3000,
        });
        supplierEditDialog.value = false;
        }
    }
    catch (err) {
        console.log(err)
    }
    finally {
        loading.value = false
        refreshData()
    }
  }
  
  const editingSupplier = async () => {
    loading.value = true;
    const data = {
        supplier_tel: supplier.value.supplier_tel,
        supplier_status: supplier.value.supplier_status,
        supplier_company_name: supplier.value.supplier_company_name,
        supplier_company_number: supplier.value.supplier_company_number,
        supplier_company_address: supplier.value.supplier_company_address,
        supplier_type : supplier.value.supplier_type,
        remark : supplier.value.supplier_remark
    }
    try {
        const response = await Suppliers.editSupplier(id, data);
        if (response.data) {
        toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: "เแก้ไขร้านค้าใหม่แล้ว",
            life: 3000,
        });
        supplierEditDialog.value = false;
        refreshData()
        } else {
        toast.add({
            severity: "error",
            summary: "มีบางอย่างผิดพลาด",
            detail: "แก้ไขร้านค้าล้มเหลว",
            life: 3000,
        });
        supplierEditDialog.value = false;
        }
    }
    catch (err) {
        console.log(err)
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
  </script>
  