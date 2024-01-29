<template>
    <div>
        <div v-if="showModal" class="modal-container">
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
                                        <strong>บ้านสวนสวยการ์เด้นคอร์เปอเรชั่น</strong>
                                    </div>
                                    <br>
                                    146 ถนนจอมทองบูรณะ แขวงบางมด<br>
                                    เขตบางมด กรุงเทพมหานคร 10150<br>
                                    โทร : 0877777777<br>
                                    beautygarden@email.com<br>
                                    เลขประจำตัวผู้เสียภาษี TAX ID : 0-1055-66228-53-5 (สำนักงานใหญ่)<br>
                                    <br>
                                    <span class="font-bold">ลูกค้า</span><br>
                                    {{ customer.name }}<br>
                                    {{ customer.address }}<br>
                                    เลขประจำตัวผู้เสียภาษี TAX ID : {{ customer.taxId }}<br><br>
                                  </div>
                                <div class="from">
                                  <span class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-emerald-600 bg-emerald-200 uppercase last:mr-0 mr-1">
                                    ใบเสร็จรับเงิน RECEIPT
                                  </span>
                                  <br>
                                  <br>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">เลขที่ : </span>
                                    {{ receipt.code }}
                                  </div>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">วันที่ : </span>
                                    {{ formatDate(receipt.start_date) }}
                                  </div>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">ผู้ขาย : </span>
                                    สวนสวยการ์เด้น
                                  </div>
                                  <div class="flex justify-between">
                                    <span class="font-bold pr-4">อ้างอิง : </span>
                                    {{ receipt.refer }}
                                  </div>
                                    <br>
                                    <hr/>
                                    <br>
                                    <div class="flex justify-between">
                                      <span class="font-bold pr-4">ผู้ติดต่อ : </span>
                                      พนักงานเอ
                                    </div>
                                    <div class="flex justify-between">
                                      <span class="font-bold pr-4">เบอร์โทร : </span>
                                      0899999999
                                    </div>
                                    <div class="flex justify-between">
                                      <span class="font-bold pr-4">อีเมล์ : </span>
                                      employee_A@gmail.com
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
                                  <td>{{ item.product_name }}</td>
                                  <td style="text-align: center;">{{ formatCurrency(item.product_amount) }}</td>
                                  <td style="text-align: right;">{{ formatCurrency(item.product_price) }}</td>
                                  <td style="text-align: right;">{{ formatCurrency(item.product_price*item.product_amount) }}</td>
                                </tr>
                              </tbody>
                            </table>
                            <div class="total">
                              <strong class="text-black">รวมเป็นเงิน <span class="px-4 ml-3 font-normal text-black">{{ formatCurrency(total) }}</span><span class="font-normal text-black">บาท</span></strong><br><br>
                              <strong class="text-black">ภาษีมูลค่าเพิ่ม 7% <span class="px-4 ml-3 font-normal text-black">{{ formatCurrency(total*0.07) }}</span><span class="font-normal text-black">บาท</span></strong><br><br>
                              <strong class="text-black">จำนวนเงินรวมทั้งสิ้น <span class="px-4 ml-3 font-normal text-black">{{ formatCurrency(total+(total*0.07)) }}</span><span class="font-normal text-black">บาท</span></strong>
                            </div>
                        </div>

                    </div>
                </div>  
                <div class="flex justify-center px-2 py-2">
                    <button @click="createDocument" class="bg-emerald-500 px-2 py-2 text-white">สร้างเอกสาร</button>
                </div>
            </div>
        </div>
        <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="toggleModal()">
            ดูตัวอย่าง
        </button>
    </div>
</template>
  
  <script>
  export default {
    name: "large-modal",
    data() {
      return {
        showModal: false,
        // items: [
        // { description: 'Item 1', quantity: 2, unitPrice: 50.00, total: 100.00 },
        // { description: 'Item 2', quantity: 1, unitPrice: 75.00, total: 75.00 }
        // // Add more items as needed
        // ]
      }
    },
    props: {
      customer: Object,
      receipt: Object,
      items: Array
    },
    computed: {
        total() {
        return this.items.reduce((sum, item) => sum + (item.product_amount*item.product_price), 0);
        }
    },
    methods: {
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
        }
    }
  }
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
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Optional: Box shadow for styling */
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