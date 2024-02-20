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
        :value="customers"
        v-model:selection="selectedCustomers"
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
          field="customer_number"
          header="รหัสลูกค้า"
          sortable
          style="min-width: 12rem"
          class="border-b"
        ></Column>
        <Column field="customer_name" header="ชื่อลูกค้า" sortable style="min-width: 16rem" class="border-b">
          <template #body="slotProps">
            {{
              slotProps.data.customer_lastname &&
              slotProps.data.customer_lastname?.trim() !== "null"
                ? `${slotProps.data.customer_name} (${slotProps.data.customer_lastname})`
                : `${slotProps.data.customer_name}`
            }}
          </template>
        </Column>
        <Column
          field="customer_type"
          header="ประเภทลูกค้า"
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
              @click="seeCustomer(slotProps.data)"
            />
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              class="text-yellow-500"
              @click="editCustomer(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              class="text-red-500"
              @click="confirmDeleteCustomer(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="customerDialog"
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

      <template #footer>
        <Button label="ยกเลิก" icon="pi pi-times" text @click="hideDialog" />
        <Button
          label="บันทึก"
          icon="pi pi-check"
          :loading="loading"
          text
          @click="editingCustomer"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCustomerDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="customer"
          >คุณแน่ใจว่าต้องการลบลูกค้ารายนี้หรือไม่ ?<b>{{ customer.customer_name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          class="py-3"
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteCustomerDialog = false"
        />
        <Button
          class="py-3"
          label="ยืนยัน"
          icon="pi pi-check"
          text
          @click="deleteCustomer"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="deleteCustomersDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="customer">คุณแน่ใจว่าต้องการลบลูกค้ารายนี้หรือไม่ ?</span>
      </div>
      <template #footer>
        <Button
          label="ยกเลิก"
          icon="pi pi-times"
          text
          @click="deleteCustomersDialog = false"
        />
        <Button label="ยืนยัน" icon="pi pi-check" text @click="deleteSelectedCustomers" />
      </template>
    </Dialog>
    <Dialog v-model:visible="openCustomer" modal :header="selectedCustomer?.customer_number" :style="{ width: '50vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="flex flex-col gap-y-2">
        <span><strong>ชื่อลูกค้า : </strong>{{ selectedCustomer?.customer_name }} 
          {{ selectedCustomer?.customer_lastname.trim()!=='' 
          ? `(${selectedCustomer?.customer_lastname})` 
          : null }}
        </span>
        <span><strong>เลขประจำตัวผู้เสียภาษี TAX ID : </strong>{{ selectedCustomer?.customer_taxnumber }}</span>
        <span><strong>ที่อยู่ : </strong>{{ selectedCustomer?.customer_position }}</span>
        <span><strong>ประเภทลูกค้า : </strong>{{ selectedCustomer?.customer_type }}</span>
        <span><strong>อีเมล์ Email : </strong>{{ selectedCustomer?.customer_email }}</span>
        <span><strong>เบอร์โทร : </strong>{{ selectedCustomer?.customer_phone }}</span>
        <span><strong>ผู้ติดต่อ : </strong>{{ selectedCustomer?.customer_contact }}</span>
        <span><strong>เบอร์โทรผู้ติดต่อ : </strong>{{ selectedCustomer?.customer_contact_number }}</span>
      </div>
  </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { FilterMatchMode } from "primevue/api";
import { useToast } from "primevue/usetoast";
import { Customers } from "@/service/Customer";

onMounted(async () => {
  Customers.getCustomers().then((data) => (customers.value = data.data));
});

const isMain = ref(false)
const openCustomer = ref(false);
const loading = ref(false);
const customerEditDialog = ref(false);
const lastRefreshed = ref()
const toast = useToast();
const dt = ref();
const customer = ref({});
const customers = ref();
const selectedCustomer = ref();
const customerDialog = ref(false);
const deleteCustomerDialog = ref(false);
const deleteCustomersDialog = ref(false);
const selectedCustomers = ref();
const uploadfiles = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const submitted = ref(false);
const statuses = ref(["ทั่วไป", "องค์กร", "หน่วยงานราชการ", "ลูกค้ารายเดือน", "VIP"]);

const changeMain = () => {
  if(isMain.value && customer.value){
    customer.value.customer_lastname = 'สำนักงานใหญ่'
  } else {
    customer.value.customer_lastname = null
  }
}

const refreshData = () => {
  Customers.getCustomers().then((data) => (customers.value = data.data));
  const currentTimestamp = Date.now();
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(currentTimestamp));
  lastRefreshed.value = formattedTime
};

const seeCustomer = (data) => {
  openCustomer.value = true;
  selectedCustomer.value = data;
  console.log("data", selectedCustomer.value);
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
  customer.value = {};
  submitted.value = false;
  customerDialog.value = true;
};
const hideDialog = () => {
  customer.value = {};
  customerDialog.value = false;
  customerEditDialog.value = false;
  submitted.value = false;
};

const editCustomer = (prod) => {
  customer.value = { ...prod };
  customerEditDialog.value = true;
  if(customer.value.customer_lastname && customer.value.customer_lastname.trim() === 'สำนักงานใหญ่'){
    isMain.value = true
  } else {
    isMain.value = false
  }
};
const confirmDeleteCustomer = (prod) => {
  customer.value = prod;
  deleteCustomerDialog.value = true;
};
const deleteCustomer = async () => {
  const customers_to_delete = customer.value;
  if (customers_to_delete) {
    console.log(customers_to_delete._id);
    await Customers.deleteCustomer(customers_to_delete._id);
  }
  await Customers.getCustomers().then((data) => (customers.value = data.data));
  deleteCustomerDialog.value = false;
  customer.value = {};
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "ลบใบลูกค้าแล้ว",
    life: 3000,
  });
};

const exportCSV = () => {
  dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deleteCustomersDialog.value = true;
};

const deleteSelectedCustomers = async () => {
  const customers_to_delete = customers.value.filter(
    (val) => !selectedCustomers.value.includes(val)
  );
  console.log(selectedCustomers.value.length);
  console.log(customers_to_delete.length);
  if (
    customers_to_delete.length > 0 
  ) {
    for (let ct of selectedCustomers.value) {
      console.log(ct._id);
      await Customers.deleteCustomer(ct._id);
    }
  }
  await Customers.getCustomers().then((data) => (customers.value = data.data));
  deleteCustomersDialog.value = false;
  selectedCustomers.value = null;
  toast.add({
    severity: "success",
    summary: "Successful",
    detail: "ลบลูกค้าแล้ว",
    life: 3000,
  });
};

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

const editingCustomer = async () => {
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

  try {
    const response = await Customers.editCustomer(customer.value._id, formData);

    if (response.data) {
      await Customers.getCustomers().then((data) => (customers.value = data.data));
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "แก้ไขข้อมูลลูกค้าแล้ว",
        life: 3000,
      });
      loading.value = false;
      customerEditDialog.value = false;
    } else {
      customerEditDialog.value = false;
      toast.add({
        severity: "success",
        summary: "สำเร็จ",
        detail: "แก้ไขข้อมูลลูกค้าแล้ว",
        life: 3000,
      });
      loading.value = false;
      await Customers.getCustomers().then((data) => (customers.value = data.data));
    }
  } catch (err) {
    customerEditDialog.value = false;
      toast.add({
        severity: "error",
        summary: "มีบางอย่างผิดพลาด",
        detail: "แก้ไขข้อมูลลูกค้าล้มเหลว",
        life: 3000,
      });
    loading.value = false;
    await Customers.getCustomers().then((data) => (customers.value = data.data));
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "ทั่วไป":
      return "success";

    case "ลูกค้ารายเดือน":
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
