<template>
  <div class="w-full h-full bg-white overflow-x-hidden overflow-y-hidden" @click="close">
    <div class="modal-container w-full h-full" id="exportContent">
      <!-- Your modal content goes here -->
      <div class="modal h-full">
        <!-- Modal content -->
        <div class="modal-content h-full">
          <div>
            <div class="invoice text-xs">
              <div class="flex flex-wrap gap-3 justify-start pb-2 items-center">
                <div>
                  <img
                    v-if="data.data.customer_branch?.Branch_iden_number!=='-'"
                    :src="`https://drive.google.com/thumbnail?id=${data.data.customer_branch?.Branch_iden_number}`"
                    alt="..."
                    class="rounded-full w-[75px] h-[75px] align-middle border-none"
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
                  <p v-if="data.data.customer_branch?.isVat">
                    เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_branch?.taxnumber }}
                  </p>
                  <br />
                  <span class="font-bold">ลูกค้า</span>
                  <p>{{ data.data.customer_detail?.customer_name }} {{ 
                    data.data.customer_detail?.customer_lastname && data.data.customer_detail?.customer_lastname!=='undefined' 
                    ? '(' + data.data.customer_detail?.customer_lastname + ')'
                    : null 
                  }}</p>
                  <p>{{ data.data.customer_detail?.customer_address }}</p>
                  <p>{{ data.data.customer_detail?.customer_email !== 'undefined' ? data.data.customer_detail?.customer_email : null }}</p>
                  <p v-if="data.data.customer_branch?.isVat">
                    เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_detail?.tax_id !== 'undefined' ? data.data.customer_detail?.tax_id : '' }}
                  </p>
                  <br/>
                </div>
                <div class="from">
                  <span
                    class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-black bg-yellow-200 uppercase last:mr-0 mr-1"
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

              <table class="border-b min-h-[80px] border h-full">
                <thead>
                  <tr>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border rounded-tl-xl pb-0 pt-2" style="text-align: center">
                      <p>ที่</p>
                      <small class="font-normal">No.</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>รายละเอียด</p>
                      <small class="font-normal">Description</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>จำนวน</p>
                      <small class="font-normal">Quantity</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>ราคา/หน่วย</p>
                      <small class="font-normal">Unit Price</small>
                    </th>
                    <th v-if="data.data.customer_branch?.isVat" :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>VAT 7%</p>
                      <small class="font-normal"></small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2 rounded-tr-xl" style="text-align: center">
                      <p>จำนวนเงิน</p>
                      <small class="font-normal">Amount Price</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <!-- <tr class="border">
                    <td class="border">
                      
                    </td>
                    <td class="py-2 border">
                      <strong class="text-md">
                        {{ data.data.product_head }}
                      </strong>
                    </td>
                    <td class="border">
                      
                    </td>
                    <td class="border">
                      
                    </td>
                    <td v-if="data.data.customer_branch?.isVat">
                      
                    </td>
                    <td class="border">
                      
                    </td>
                  </tr> -->
                  <tr class="border" v-for="(product, index) in data.data.product_detail" :key="index">
                    <td class=".td flex justify-center" style="text-align: center">
                      {{ index + 1 }}
                    </td>
                    <td class=".td border">
                      <div class="flex flex-col-reverse">
                        <div class="flex gap-2">
                          <img 
                            v-for="(pic, index) in product.product_logo"
                            v-if="product.product_logo && product.product_logo.length>0" 
                            class="w-[150px] pr-3 object-contain" 
                            :src="`https://drive.google.com/thumbnail?id=${pic}`" 
                            :alt="index" 
                          />
                        </div>
                        <article class="text-wrap w-[200px]">
                            <strong>{{ product.product_name }}</strong>
                            <p v-for="(p, pindex) in product.product_text" style="text-align: left" :key="pindex">
                                {{ p }}
                            </p>
                        </article>
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center h-full py-2">
                        {{ product.product_amount }} {{ product.unit }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2">
                        {{ formatCurrency(product.product_price) }}
                      </div>
                    </td>
                    <td v-if="data.data.customer_branch?.isVat" class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2">
                        {{ 
                          product.vat_price > 0
                          ? formatCurrency(product.vat_price) 
                          : 0
                        }}
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
                  <article class="text-wrap w-[402px] h-full min-h-[50px] text-start pr-5">
                    <strong>หมายเหตุ :</strong>
                    <pre v-for="(mark, mindex) in data.data.remark" class="text-wrap" :key="mindex"
                    >{{ mark }}</pre>
                  </article>
                  <div class="h-full flex items-end pb-2">
                    <div class="h-full w-full flex items-end pb-2">
                      <div class="flex border-t w-full pt-2 justify-start text-start gap-2">
                        <strong>ชำระผ่าน : </strong>
                        <span v-if="data.data.transfer ==='cash' || data.data.bank.remark_2 === '' ">เงินสด</span>
                        <div class="flex flex-col" v-else>
                          <span>บัญชีธนาคาร {{ data.data.bank.remark_2 }} หมายเลข {{ data.data.bank?.status }}</span>
                          <span>ชื่อบัญชี {{ data.data.bank?.name }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                </div>
                <table class="h-full" v-if="data.data.sumVat">
                    <tbody class="h-full">
                      <tr class="flex justify-between w-full pb-1">
                        <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                        <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice) }}</span>บาท</td>
                      </tr>
                      
                      <tr class="flex justify-between w-full pb-1">
                        <td style="text-align: left"><span class="pl-5 font-semibold">ส่วนลด {{ formatCurrency(data.data.discount*100/totalPrice) || '-' }} (%)</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || '0.00' }}</span>บาท</td>
                      </tr>
                      <tr class="flex justify-between w-full pb-1">
                        <td style="text-align: left"><span class="pl-5 font-semibold">ราคาหลังหักส่วนลด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice-data.data.discount) }}</span>บาท</td>
                      </tr>
                      
                      <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                        <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                        <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice-data.data.discount+vat) }}</span>บาท</td>
                      </tr>

                      <tr class="flex justify-between items-center w-full py-2 bg-yellow-200 " :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left">
                          <div class="flex flex-col items-center">
                            <strong class="pl-5 font-semibold">
                              จำนวนเงินทั้งสิ้น
                            </strong>
                          </div>
                        </td>
                        <td style="text-align: right">
                          <strong class="pr-3" v-if="data.data?.customer_branch?.isVat">
                            {{ formatCurrency(totalPrice-data.data.discount+vat) }}
                          </strong>
                          <strong class="pr-3" v-else>
                            {{ formatCurrency(totalPrice-data.data.discount) }}
                          </strong>
                          บาท
                        </td>
                          
                      </tr>
                    </tbody>
                </table>
                
                <table v-if="!data.data.sumVat">
                  <tbody>
                    
                    <tr class="flex justify-between w-full pb-1">
                      <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                      <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice) }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ส่วนลด {{ formatCurrency(data.data.discount*100/totalPrice) || '-' }} (%)</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount*100/totalPrice) || 0 }}</span>บาท</td>
                    </tr>
                    
                    <tr class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคาหลังหักส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice-data.data.discount) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice-data.data.discount+vat) }}</span>บาท</td>
                    </tr>
                    
                    <tr class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left"><strong class="pl-5">จำนวนเงินทั้งสิ้น</strong></td>
                      <td style="text-align: right">
                        <strong class="pr-3">{{ formatCurrency(totalPrice-data.data.discount+vat) }}</strong>
                        บาท
                      </td>
                    </tr>
                    <tr class="flex justify-between items-center w-full py-2 bg-yellow-200 " :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left">
                        <div class="flex flex-col items-center">
                          <strong class="pl-5 font-semibold">
                            จำนวนเงินทั้งสิ้น
                          </strong>
                        </div>
                      </td>
                      <td style="text-align: right">
                        <strong class="pr-3">
                          {{ formatCurrency(totalPrice-data.data.discount+vat) }}
                        </strong>
                        บาท
                      </td>
                    </tr>
                  </tbody>
              </table>
              </div>
              <div class="w-full min-w-[100px] h-fit min-h-[35px] bg-yellow-200 text-center border-b border-r border-l flex justify-center items-center"
                :style="{ backgroundColor: `#${data.color}` }">
                <p class="font-bold">
                  ( {{ 
                    data.data.customer_branch?.isVat
                    ? formatNumberToText((totalPrice-data.data.discount+vat)) + 'ถ้วน' 
                    : formatNumberToText((totalPrice-data.data.discount)) + 'ถ้วน'
                  }} )
                </p>
              </div>
              <tr v-if="data.data.vat.percen_deducted" class="flex justify-between items-center w-full border-b border-l border-r pt-2 pb-2" :style="{ backgroundColor: `#${data.color}` }">
                <td>
                </td>
                <td style="text-align: left">
                    <span class="pl-5 font-semibold">
                      มูลค่า ภาษีหัก ณ. ที่จ่าย <span class="px-2">{{ formatCurrency(withHolding) }}</span> บาท
                    </span>
                </td>
              </tr>
            </div>
          </div>
        
        <div class="flex justify-center px-2">
            <table>
                <tbody>
                  <tr>
                    <td class="border text-sm" style="text-align: center; padding:0;">ผู้เสนอราคา</td>
                    <td class="border text-sm" style="text-align: center; padding:0;">ผู้อนุมัติการสั่งซื้อ</td>
                  </tr>
                  <tr class="border">
                    <td class="h-full min-h-[50px] w-full flex justify-around items-end" style="text-align: bottom; padding:0;">
                      <div class="text-center w-fit text-sm pt-5 px-2 flex flex-col items-center justify-end">
                        <img v-if="data.isSign" class="w-[130px]" 
                        :src="ssn_2" alt="..." />
                        <p v-if="!data.isSign">............................</p>
                        <p>( เตชิตา รัตนกิตติกร )</p>
                        <p>ผู้อนุมัติ</p>
                        <p v-if="data.data.start_date">วันที่ <span class="px-2">{{ formatDate(data.data.start_date) }}</span></p>
                        <p v-if="!data.data.start_date">{{`วันที่...../....../.......`}}</p>
                      </div>
                      <div class="text-center w-fit text-sm pt-8 flex flex-col items-center justify-end">
                        
                        <img v-if="data.isSign" class="w-[200px]" 
                        :src="ssn_1" alt="..." />
                        <p v-if="!data.isSign">............................</p>
                        <p>( เพชรลดา หงษ์สี )</p>
                        <p>ผู้ออกเอกสาร</p>
                        <p v-if="data.data.start_date">วันที่ <span class="px-2">{{ formatDate(data.data.start_date) }}</span></p>
                        <p v-if="!data.data.start_date">{{`วันที่...../....../.......`}}</p>
                      </div>
                        
                    </td>
                    <td class="border h-full min-h-[50px] px-4 w-fit" style="text-align: bottom;">
                      <div class="text-center w-full h-full text-sm flex flex-col mt-auto pt-10 items-center justify-end" style="text-align: bottom;">
                          <p>____________________</p>
                        <p class="break-words max-w-[300px]" v-if="data.data.customer_detail.customer_name && data.data.customer_detail.customer_name.trim() !==''">
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
import { onMounted, computed } from 'vue';
import ssn_1 from '@/assets/img/ssn-1.png'
import ssn_2 from '@/assets/img/ssn-2.png'

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

const vat = computed(()=>{
  const all_vat = data.data.product_detail.map((item)=>{
    return item.vat_price
  })
  const result = all_vat.length > 0 ? all_vat.reduce((a,b) => a + b) : 0
  return result
})

const withHolding = computed(()=>{
  const percent = data.data.vat.percen_deducted
  const price = totalPrice.value
  const result = percent > 0 ? price*percent/100 : 0
  return result
})

const totalPrice = computed(()=>{
  const all_price = data.data.product_detail.map((item)=>{
    const total = item.product_price*item.product_amount
    return total
  })
  const result = all_price.length > 0 ? all_price.reduce((a,b) => a + b) : 0
  return result
})

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
        if (i === num.length - 2 && digit === 2) {
          // If in the tens position and digit is 2, use "ยี่"
          result += "ยี่" + thaiPlaces[num.length - i - 1];
        } else {
          result += thaiNumerals[digit] + thaiPlaces[num.length - i - 1];
        }
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

const data = defineProps(['data', 'color', 'isSign'])

const formatCurrency = (value) => {
  if (value !== undefined && value !== null) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return;
}

const formatDate = (isoDateString) => {
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
  padding: 2px;
  border-radius: 0px;
  box-shadow: 0 0 0px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: end;
  margin-bottom: 10px;
}

.from,
.to {
  margin-bottom: 5px;
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
  margin-top: 10px;
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
  --tw-bg-opacity: 1;
  background-color: rgb(254 240 138 / var(--tw-bg-opacity));
}

.total {
  margin-top: 0px;
  text-align: right;
}
.mt-5 {
    margin-top: 5px;
  }

</style>
