<template>
  <div>
      <div v-if="showModal" class="modal-container" id="exportContent">
          <!-- Your modal content goes here -->
          <div class="modal">
              <div class="flex justify-end px-6 py-2">
                  <button @click="showModal=!showModal" class="text-red-500">X</button>
              </div>
              <!-- Modal content -->
              <div class="modal-content">
                  <div style="width:600px; height:700px;" class="overflow-y-auto">
                      
                      <div class="invoice text-xs">
                          <div class="flex justify-between">
                              <div class="from">
                                  <div class="flex justify-items-center items-center">
                                      <div class="flex flex-wrap justify-center">
                                          <div style="width:75px;" class="pr-4">
                                            <img src="@/assets/img/logo.png" alt="..." class="shadow rounded-full max-w-full h-auto align-middle border-none" />
                                          </div>
                                      </div>
                                      <strong>{{ headData?.Branch_company_name || 'สวนสวยการ์เด้นคอร์เปอเรชั่น' }}</strong>
                                  </div>
                                  <br>
                                  146 ถนนจอมทองบูรณะ แขวงบางมด<br>
                                  เขตบางมด กรุงเทพมหานคร 10150<br>
                                  โทร : {{ headData?.Branch_company_number }}<br>
                                  {{ headData?.company_email }}<br>
                                  เลขประจำตัวผู้เสียภาษี TAX ID : {{ headData?.taxnumber }} {{ headData?.Branch_iden ? `(${headData?.Branch_iden})` : '' }}<br>
                                  <br>
                                  <span class="font-bold">ลูกค้า</span><br>
                                  {{ customer.name }}<br>
                                  {{ customer.address }}<br>
                                  เลขประจำตัวผู้เสียภาษี TAX ID : {{ customer.taxId }}<br><br>
                                </div>
                              <div class="from">
                                <span class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-orange-600 bg-orange-200 uppercase last:mr-0 mr-1">
                                  ใบเสนอราคา QUOTATION
                                </span>
                                <br>
                                <br>
                                <div class="flex justify-between">
                                  <span class="font-bold pr-4">เลขที่ : </span>
                                  {{ quotation.quotation }}
                                </div>
                                <div class="flex justify-between">
                                  <span class="font-bold pr-4">วันที่ : </span>
                                  {{ formatDate(quotation.start_date) }}
                                </div>
                                <div class="flex justify-between">
                                  <span class="font-bold pr-4">วันที่สิ้นสุด : </span>
                                  {{ formatDate(quotation.end_date) }}
                                </div>
                                <div class="flex justify-between">
                                  <span class="font-bold pr-4">ผู้ขาย : </span>
                                  {{ headData?.Branch_company_name }}
                                </div>
                                  <br>
                                  <hr/>
                                  <br>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">ผู้ติดต่อ : </span>
                                    {{ headData?.contact_name }}
                                  </div>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">เบอร์โทร : </span>
                                    {{ headData?.contact_number }}
                                  </div>
                                  <br>
                                  <hr/>
                              </div>
                          </div>
                          
                          <table>
                            <thead>
                              <tr>
                                <th style="text-align: center;">ที่</th>
                                <th style="text-align: center;">รายละเอียด</th>
                                <th style="text-align: center;">จำนวน</th>
                                <th style="text-align: center;">ราคา/หน่วย</th>
                                <th style="text-align: center;">ยอดรวม</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(item, index) in items" :key="index">
                                <td style="text-align: center;">{{ index+1 }}</td>
                                <td>
                                  <div class="flex">
                                    <div class="mr-3" v-if="item.product_logo" style="width: 80px;">
                                      <img :src="item.product_logo" 
                                      :alt="item.product_name" 
                                      class="shadow rounded object-cover w-full h-full align-middle border-none" 
                                    />
                                    </div>
                                    <pre style="text-align: left;" class="text-left">
                                      {{ item.product_name }}
                                    </pre>
                                  </div>
                                </td>
                                <td style="text-align: center;">{{ formatCurrency(item.product_amount) }}</td>
                                <td style="text-align: right;">{{ formatCurrency(item.product_price) }}</td>
                                <td style="text-align: right;">{{ formatCurrency(item.product_price*item.product_amount) }}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div class="flex justify-between total">
                            <article class="text-wrap">
                              <strong class="text-black">หมายเหตุ : 
                                <span class="font-normal"><p>
                                  {{ remark }}
                                </p></span>
                              </strong>
                            </article>
                          
                            <div class="total">
                              <strong class="text-black">ราคาสินค้า/บริการ <span class="px-4 ml-3 font-normal text-black">{{ totalProductPrice }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong class="text-black">ส่วนลด <span class="px-4 ml-3 font-normal text-black">{{ discount }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong class="text-black">ราคาหลังหักส่วนลด <span class="px-4 ml-3 font-normal text-black">{{ discountedPrice }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong class="text-black">ภาษีมูลค่าเพิ่ม VAT 7% <span class="px-4 ml-3 font-normal text-black">{{ vat }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong class="text-black">ราคารวม VAT <span class="px-4 ml-3 font-normal text-black">{{ vatIncludedPrice }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong v-if="deducatePercent" class="text-black">หัก ณ ที่จ่าย {{ deducatePercent }}% <span class="px-4 ml-3 font-normal text-black">{{ deducatedPrice }}</span><span class="font-normal text-black">บาท</span></strong><br>
                              <strong class="text-black">ยอดชำระทั้งสิ้น <span class="px-4 ml-3 font-normal text-black">{{ net }}</span><span class="font-normal text-black">บาท</span></strong>
                            </div>
                        </div>
                      </div>

                  </div>
              </div>  
              <div class="flex justify-center px-2 py-2">
                  <button @click.prevent="createDocument" class="bg-emerald-500 mx-4 px-2 py-2 text-white">สร้างเอกสาร</button>
                  <button @click.prevent="exportToPDF" class="bg-emerald-500 mx-4 px-2 py-2 text-white">
                    Export to PDF
                  </button>
              </div>
          </div>
      </div>
      <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="toggleModal()">
        ดูตัวอย่าง
      </button>
  </div>
</template>

<script>
/* eslint-disable */
import html2pdf from 'html2pdf.js';

export default {
  name: "large-modal",
  data() {
    return {
      showModal: false,
    }
  },
  props: {
    customer: Object,
    quotation: Object,
    items: Array,
    totalProductPrice: String,
    discount:String,
    discountedPrice: String,
    vat:String,
    vatIncludedPrice:String,
    deducatePercent:Number,
    deducatedPrice:String,
    net:String,
    sumVat:Boolean,
    remark: String,
    headData: Object
  },
  computed: {
  
  },
  methods: {
// Your existing methods here

/* exportToPDF: function () {
  const element = document.getElementById('to-print');
  html2pdf(element);
}, */

exportToPDF: function() {
    // Specify the div or element to export
    const contentToExport = document.getElementById('to-print');

    // Configure PDF export options
    const pdfOptions = {
      margin: 10,
      filename: 'exported-document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    // Use html2pdf library to export the content to PDF
    html2pdf().from(contentToExport).set(pdfOptions).outputPdf(pdf => {
      // Save the PDF file
      const pdfBlob = new Blob([pdf], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfOptions.filename;
      link.click();
      URL.revokeObjectURL(pdfUrl);
    });
  },
    


    toggleModal: function(){
      this.showModal = !this.showModal;
    },
      formatCurrency(amount) {
      // You can use a library like 'numeral' for more advanced formatting

      return `${parseFloat(parseFloat(amount).toFixed(2)).toLocaleString()}`;
      },
      formatDate: function(date){
        const inputDateStr = date;
        const [year, month, day] = inputDateStr.split("-");
        const outputDateStr = `${day}/${month}/${year}`;
        return (date!=='-') ? outputDateStr : '-'
      },
      createDocument: function() {
        this.$emit('createDoc')
        this.showModal = false
      }
  }
}
</script>

<script setup>
const exportToPDF = () => {
  const contentToPrint = document.getElementById('exportContent');
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write('<html><head><title>Export to PDF</title></head><body>');
    printWindow.document.write(contentToPrint.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  } else {
    console.error('Error opening print window');
  }
};

const createDocument = () => {
  // Your logic for creating a document goes here
  console.log('Creating document...');
};
</script>

<style scoped>

.modal-container {
display: flex;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
z-index: 1000;
}

.modal {
background-color: #fff; /* Modal background color */
padding: 0px;
border-radius: 0px;
box-shadow: 0 0px 0px rgba(0, 0, 0, 0.2); /* Optional: Box shadow for styling */
max-width: 297mm;
  max-height: 210mm;
  overflow: auto; 
}

.modal-content {
/* Style your modal content as needed */
}

.invoice {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: end;
  margin-bottom: 20px;
}

.from,
.to {
  margin-bottom: 10px;
}

.from strong,
.to strong {
  display: block;
  font-size: 1.2em;
  margin-bottom: 5px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #0c9143a4;
}

.total {
  margin-top: 20px;
  text-align: right;
}

</style>