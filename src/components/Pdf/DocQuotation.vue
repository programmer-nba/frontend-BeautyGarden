<template>
  <div class="w-full h-full bg-white overflow-y-hidden" @click="close">
    <div class="modal-container w-full mt-2 h-full" id="exportContent">
      <!-- Your modal content goes here -->
      <div class="modal h-full">
        <!-- Modal content -->
        <div class="modal-content h-full">
          <div>
            <div class="invoice text-xs">
              <div class="flex flex-wrap justify-start items-center">
                <div>
                  <img
                    v-if="data.data.customer_branch?.Branch_iden_number!=='-'"
                    :src="`https://drive.google.com/thumbnail?id=${data.data.customer_branch?.Branch_iden_number}`"
                    alt="..."
                    class="rounded-full w-[100px] h-[100px] align-middle border-none"
                  />
                </div>
                <div class="flex justify-items-center items-center">
                  <strong>{{ data.data.customer_branch?.Branch_company_name }}</strong>
                </div>
              </div>
              <div class="flex justify-between">
                <div class="from">
                  <article class="text-wrap w-[250px]">
                    <p>{{ data.data.customer_branch?.Branch_company_address }}</p>
                  </article>
                  โทร : {{ data.data.customer_branch?.Branch_company_number }}<br />
                  อีเมลล์ : {{ data.data.customer_branch?.company_email }}
                  <br />
                  เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_branch?.taxnumber }}<br />
                  <br />
                  <span class="font-bold">ลูกค้า</span><br />
                  {{ data.data.customer_detail?.customer_name }}<br />
                  {{ data.data.customer_detail?.customer_email }}<br />
                  เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_detail?.tax_id !== 'undefined' ? data.data.customer_detail?.tax_id : '' }}<br /><br />
                </div>
                <div class="from">
                  <span
                    class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-black bg-orange-200 uppercase last:mr-0 mr-1"
                    :style="{ backgroundColor: `#${data.color}` }"
                    >
                    ใบเสนอราคา QUOTATION
                  </span>
                  <br />
                  <br />
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">เลขที่ : </span>
                    {{ data.data.quotation }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">วันที่เริ่ม Date : </span>
                    {{ formatDate(data.data.start_date) }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">วันที่สิ้นสุด Date due : </span>
                    {{ formatDate(data.data.end_date) }}
                  </div>
                  <br />
                  <hr />
                  <br />
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">ผู้ติดต่อ : </span>
                    {{ data.data.customer_branch?.contact_name }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">เบอร์โทร : </span>
                    {{ data.data.customer_branch?.contact_number }}
                  </div>
                  <br />
                  <hr />
                </div>
              </div>

              <table class="border-b min-h-[100px] h-full">
                <thead>
                  <tr>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th rounded-tl-xl pb-0 pt-2" style="text-align: center">
                      <p>ที่</p>
                      <small class="font-normal">No.</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>รายละเอียด</p>
                      <small class="font-normal">Description</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>จำนวน</p>
                      <small class="font-normal">Quantity</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>ราคา/หน่วย</p>
                      <small class="font-normal">Unit Price</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2 rounded-tr-xl" style="text-align: center">
                      <p>จำนวนเงิน</p>
                      <small class="font-normal">Amount Price</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border py-2" v-for="(product, index) in data.data.product_detail" :key="index">
                    <td class=".td flex justify-center" style="text-align: center">
                      {{ index + 1 }}
                    </td>
                    <td class=".td border">
                      <div class="flex">
                        <img v-if="product.product_logo && product.product_logo.trim()!==''" class="w-[200px] pr-3" :src="`https://drive.google.com/thumbnail?id=${product.product_logo}`" :alt="index" />
                        <article class="text-wrap w-[250px]">
                            <strong>{{ product.product_name }}</strong>
                            <p v-for="(p, pindex) in product.product_text" style="text-align: left" :key="pindex">
                                {{ p }}
                            </p>
                        </article>
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center h-full py-2">
                        {{ formatCurrency(product.product_amount) }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2">
                        {{ formatCurrency(product.product_price) }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2">
                        {{ formatCurrency(product.product_total) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex w-full justify-between total border-r border-l border-b">
                <div class="flex flex-col border-r">
                  <article class="text-wrap w-[450px] min-h-[80px] text-start pr-5">
                    <strong>หมายเหตุ :</strong>
                    <pre v-for="(mark, mindex) in data.data.remark" class="text-wrap" :key="mindex"
                    >{{ mark }}</pre>
                  </article>
                    <div class="w-full min-w-[100px] h-fit min-h-[30px] mt-6 bg-orange-200 text-center border-t border-l flex justify-center items-center"
                      :style="{ backgroundColor: `#${data.color}` }">
                      <p class="font-bold">
                        ( {{ formatNumberToText(data.data.vat.totalVat_deducted) + 'ถ้วน' }} )
                      </p>
                    </div>
                <div class="flex flex-col border-t py-2">
                    <h1 class="text-md font-bold text-start">
                      ช่องทางการชำระเงิน :
                    </h1>
                    <span class="text-start w-full">
                      ธนาคาร {{ data.data.bank?.remark_2 ? data.data.bank?.remark_2 : '.......' }} 
                      เลขบัญชี {{ data.data.bank?.status ? data.data.bank?.status : '.........' }} 
                      ชื่อบัญชี {{ data.data.bank?.name ? data.data.bank?.name : '.........' }}
                    </span>
                  </div>
                </div>
                <table v-if="data.data.sumVat">
                    <tbody>
                      <tr class="flex justify-between w-full">
                        <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5">ราคาสินค้า/บริการ</span></td>
                        <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total) }}</span>บาท</td>
                      </tr>
                      <tr class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">ส่วนลด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || 0 }}</span>บาท</td>
                      </tr>
                      <tr class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">ราคาหลังหักส่วนลด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.net) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.vat.amount_vat) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">ราคารวม VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.vat.totalvat) }}</span>บาท</td>
                      </tr>
                      <tr class="flex justify-between w-full" v-if="data.data.vat.percen_deducted">
                        <td style="text-align: left"><span class="pl-5">หัก ณ ที่จ่าย {{ data.data.vat.percen_deducted }}%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.vat.total_deducted) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left"><strong class="pl-5">ยอดชำระทั้งสิ้น</strong></td>
                        <td style="text-align: right"><strong class="pr-3">{{ formatCurrency(data.data.vat.totalVat_deducted) }}</strong>บาท</td>
                      </tr>
                      <tr v-if="!data.data.customer_branch?.isVat" class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left"><strong class="pl-5">ยอดชำระทั้งสิ้น</strong></td>
                        <td style="text-align: right"><strong class="pr-3">{{ formatCurrency((data.data.vat.totalvat-data.data.vat.amount_vat)) }}</strong>บาท</td>
                      </tr>
                    </tbody>
                </table>
                <table v-if="!data.data.sumVat">
                  <tbody>
                    <tr class="flex justify-between w-full">
                      <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5">ราคาสินค้า/บริการ</span></td>
                      <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total_products.total_product) }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5">ส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || 0 }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5">ราคาหลังหักส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total_products.total_discount) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5">VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total_products.amount_vat) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5">ราคารวม VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total_products.amount_vat + data.data.total_products.total_discount) }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full" v-if="data.data.vat.percen_deducted">
                      <td style="text-align: left"><span class="pl-5">หัก ณ ที่จ่าย {{ data.data.total_products.percen_payment }}%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.total_products.after_discoun_payment) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data.customer_branch?.isVat" class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left"><strong class="pl-5">ยอดชำระทั้งสิ้น</strong></td>
                      <td style="text-align: right"><strong class="pr-3">{{ formatCurrency(data.data.total_products.total_all_end) }}</strong>บาท</td>
                    </tr>
                    <tr v-if="!data.data.customer_branch?.isVat" class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left"><strong class="pl-5">ยอดชำระทั้งสิ้น</strong></td>
                      <td style="text-align: right"><strong class="pr-3">{{ formatCurrency(data.data.total_products.total_all_end) }}</strong>บาท</td>
                    </tr>
                  </tbody>
              </table>
              </div>
            </div>
          </div>
        
        
        <div class="flex justify-center px-2">
            <table>
                <tbody>
                  <tr>
                    <td class="border text-sm" style="text-align: center; padding:0;">ผู้เสนอราคา</td>
                    <td class="border text-sm" style="text-align: center; padding:0;">ผู้สั่งซื้อ / customer</td>
                  </tr>
                  <tr>
                    <td class="border-b border-l h-full min-h-[50px] flex gap-2 justify-enter items-center" style="text-align: bottom; padding:0;">
                        <div class="text-center w-full text-sm pt-5 flex flex-col items-center justify-center">
                          <img class="w-[75px] border-b pb-1 mb-1" 
                          v-if="data.data.signature?.image_signature 
                          && data.data.signature?.image_signature.trim()!==''
                          && data.data.signature?.image_signature.trim()!=='-'
                          " 
                          :src="`https://drive.google.com/thumbnail?id=${data.data.signature?.image_signature}`" />
                          <p 
                          v-if="!data.data.signature?.image_signature 
                          || data.data.signature?.image_signature.trim()===''
                          || data.data.signature?.image_signature.trim()==='-'
                          ">____________________</p>
                          <p v-if="data.data.signature && data.data.signature?.name && data.data.signature?.name.trim() !==''
                          ">
                            ( {{ data.data.signature.name }} )
                          </p>
                          <p v-if="!data.data.signature || !data.data.signature?.name || data.data.signature?.name.trim() ===''">
                            {{`(.................................)`}}
                          </p>
                          <p v-if="data.data.signature && data.data.signature?.position && data.data.signature?.position.trim() !==''
                          ">
                            {{ data.data.signature.position }}
                          </p>
                          <p v-if="data.data.start_date">วันที่ <span class="px-2">{{ formatDate(data.data.start_date) }}</span></p>
                          <p v-if="!data.data.start_date">{{`วันที่...../....../.......`}}</p>
                        </div>
                        <div class="text-center w-full text-sm pt-5 flex flex-col items-center justify-center">
                          <img class="w-[75px] border-b pb-1 mb-1" 
                          v-if="data.data.signature?.image_signature 
                          && data.data.signature?.image_signature.trim()!==''
                          && data.data.signature?.image_signature.trim()!=='-'
                          " 
                          :src="`https://drive.google.com/thumbnail?id=${data.data.signature?.image_signature}`" />
                          <p 
                          v-if="!data.data.signature?.image_signature 
                          || data.data.signature?.image_signature.trim()===''
                          || data.data.signature?.image_signature.trim()==='-'
                          ">____________________</p>
                          <p v-if="data.data.signature && data.data.signature?.name && data.data.signature?.name.trim() !==''
                          ">
                            ( {{ data.data.signature.name }} )
                          </p>
                          <p v-if="!data.data.signature || !data.data.signature?.name || data.data.signature?.name.trim() ===''">
                            {{`(.................................)`}}
                          </p>
                          <p v-if="data.data.signature && data.data.signature?.position && data.data.signature?.position.trim() !==''
                          ">
                            {{ data.data.signature.position }}
                          </p>
                          <p v-if="data.data.start_date">วันที่ <span class="px-2">{{ formatDate(data.data.start_date) }}</span></p>
                          <p v-if="!data.data.start_date">{{`วันที่...../....../.......`}}</p>
                        </div>
                    </td>

                    <td class="border h-full min-h-[50px] p-0" style="text-align: bottom;">
                      <div class="text-center w-full h-full pt-5 text-sm flex flex-col items-center justify-center" style="text-align: bottom;">
                          <p 
                          >____________________</p>
                        <p v-if="data.data.customer_detail.customer_name && data.data.customer_detail.customer_name.trim() !==''
                            ">
                              ( {{ data.data.customer_detail.customer_name }} )
                            </p>
                            <p v-if="!data.data.customer_detail.customer_name || data.data.customer_detail.customer_name.trim() ===''">
                              {{`(.................................)`}}
                            </p>
                        
                          <p>{{`วันที่...../....../.......`}}</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>  
        </div>
        
      </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(()=>{
  setTimeout(print, 2000)
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const print = () => {
  window.print()
}

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
      for (let i = 0; i < num.length; i++) {
        const digit = parseInt(num[i]);
        if (digit !== 0) {
          result += thaiNumerals[digit] + thaiPlaces[num.length - i - 1];
        }
      }
      return result;
    }

    function convertDecimalToThaiText(num) {
      let result = "";
      for (let i = 0; i < num.length; i++) {
        const digit = parseInt(num[i]);
        if (digit !== 0) {
          result += thaiNumerals[digit] + "สิบ";
        }
      }
      return result;
    }

    const thaiIntegerText = convertIntegerToThaiText(integerPart);
    const thaiDecimalText = convertDecimalToThaiText(decimalPart);

    const thaiText =
      thaiIntegerText +
      (thaiIntegerText !== "" ? "บาท" : "") +
      thaiDecimalText +
      (thaiDecimalText !== "" ? "สตางค์" : "");
    return thaiText || "ศูนย์บาท";
  };

const data = defineProps(['data', 'color'])

const formatCurrency = (value) => {
  if (value) return value.toLocaleString({ style: "currency", currency: "THB" });
  return;
};

const formatDate = (date) => {
    if(date){
        const inputDate = date;
        const dateObj = new Date(inputDate);

        const day = dateObj.getUTCDate().toString().padStart(2, "0");
        const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, "0");
        const year = (dateObj.getUTCFullYear() + 543).toString(); // Convert to Thai Buddhist Era

        if(day!==NaN && month!==NaN && year!==NaN){
            const formattedDate = `${day}/${month}/${year}`;
            return formattedDate; // Output: 09/02/2567
        } else {
            return '-'
        }
       
    } else {
        return '-'
    }
};

</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.text-wrap {
    text-wrap: wrap;
    overflow-wrap: break-word;
}

.text-orange-600 {
  --tw-text-opacity: 1;
  color: rgb(234 88 12 / var(--tw-text-opacity));
}

.modal {
  background-color: #fff; /* Modal background color */
  padding: 0px;
  border-radius: 0px;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.2); /* Optional: Box shadow for styling */
  max-width: 100%;
  min-height: 100%;
  height: 100%;
}

.invoice {
  max-width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  padding: 5px;
  border-radius: 0px;
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
.td {
  border: 0px solid #ddd;
  padding: 10px;
  text-align: left;
}

.border {
  border: 1px solid #353434;
}

.border-b {
  border-bottom: 1px solid #353434;
}
.border-r {
  border-right: 1px solid #353434;
}
.border-l {
  border-left: 1px solid #353434;
}
.border-t {
  border-top: 1px solid #353434;
}
.th {
  background-color: #ffd89d
}

.total {
  margin-top: 0px;
  text-align: right;
}
.mt-5 {
    margin-top: 5px;
  }

</style>
