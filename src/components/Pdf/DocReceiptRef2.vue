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
                    v-if="data.data.isVat"
                    :src="logoVat"
                    alt="..."
                    class="rounded-full w-[75px] h-[75px] align-middle border-none"
                  />
                  <img
                    v-else
                    :src="logoNoVat"
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
                    <p>{{ data.data.customer_branch?.Branch_company_address?.replace("เขตบางมด", "เขตจอมทอง") }}</p>
                  </article>
                  โทร : {{ data.data.customer_branch?.Branch_company_number !== 'undefind' ? data.data.customer_branch?.Branch_company_number : null }}<br />
                  อีเมลล์ : {{ data.data.customer_branch?.company_email !=='undefine' ? data.data.customer_branch?.company_email : null }}
                  <br />
                  <span v-if="data.data?.isVat">เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_branch?.taxnumber }}</span><br />
                  <br />
                  <span class="font-bold">ลูกค้า</span><br />
                  <p>{{ data.data.customer_detail?.customer_name }} {{ 
                    data.data.customer_detail?.customer_lastname && data.data.customer_detail?.customer_lastname!=='undefined' 
                    ? '(' + data.data.customer_detail?.customer_lastname + ')'
                    : null 
                  }}</p>
                  <p>{{ data.data.customer_detail?.customer_address !== 'undefined' ? data.data.customer_detail?.customer_address : null }}</p>
                  <p>{{ data.data.customer_detail?.customer_email !== 'undefined' ? data.data.customer_detail?.customer_email : null }}</p>
                  <span>
                    เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_detail?.tax_id !== 'undefined' ? data.data.customer_detail?.tax_id : '' }}
                  </span><br /><br />
                </div>
                <div class="from">
                  <span
                    v-if="data.data?.isVat"
                    class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-black bg-green-200 uppercase last:mr-0 mr-1"
                    :style="{ backgroundColor: `#${data.color}` }"
                    >
                    ใบเสร็จรับเงิน/ใบกำกับภาษี
                  </span>
                  <span
                    v-if="!data.data?.isVat"
                    class="text-xs w-full text-center font-semibold inline-block py-1 px-2 rounded text-black bg-green-200 uppercase last:mr-0 mr-1"
                    :style="{ backgroundColor: `#${data.color}` }"
                    >
                    ใบเสร็จรับเงิน
                  </span>
                  <br />
                  <br />
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">เลขที่ : </span>
                    <p v-if="data.data.isBillVat">
                      {{ data.data.receiptVat }}
                    </p>
                    <p v-else-if="data.data.isBillVat === false">
                      {{ data.data.receiptNoVat }}
                    </p>
                    <p v-else>
                      {{ data.data.receipt }}
                    </p>
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">วันที่เริ่ม Date : </span>
                    {{ data.data.start_date_format }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">อ้างอิง : </span>
                    {{ data.data.invoice }}-{{ data.data.invoiceRef_detail.period}}
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
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>ที่</p>
                      <small class="font-normal">No.</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>รายละเอียด</p>
                      <small class="font-normal">Details</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2" style="text-align: center">
                      <p>งวดที่</p>
                      <small class="font-normal">Period</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2 rounded-tr-xl" style="text-align: center">
                      <p>ยอดชำระ</p>
                      <small class="font-normal">Amount Price</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border py-2">
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2 items-center">
                        {{ 1 }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: left">
                      <div class="flex flex-col justify-start pl-2 h-full py-2">
                        <p v-if="data.data.project?.name" class="font-semibold pb-2">{{ data.data.project?.name }}</p>
                        <p>{{ data.data.invoiceRef_detail?.paid_detail || 'ชำระงวดที่ ' + data.data.invoiceRef_detail?.period }}</p>
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center items-center h-full py-2">
                        {{ data.data.invoiceRef_detail?.period }}
                      </div>
                    </td>
                    <td class=".td border hidden" style="text-align: center">
                      <div class="flex justify-center h-full py-2">
                        {{ 
                          data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))
                          : !data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))

                          : data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount)
                          : !data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount)

                          : data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount))
                          : !data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount))

                          : '-'
                        }}
                      </div>
                    </td>
                    <td class=".td hidden border" style="text-align: center">
                      <div class="flex justify-center h-full py-2">
                        {{ 
                          data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))-data.data.invoiceRef_detail?.paid+data.data.amount_price)

                          : data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)

                          : data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)

                          : '-'
                        }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2 items-center">
                        {{ formatCurrency(data.data.amount_price) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="flex w-full justify-between total border-r border-l border-b">
                <div class="flex flex-col border-r">
                  <article class="text-wrap w-[380px] h-full min-h-[50px] text-start pr-5">
                    <strong>หมายเหตุ :</strong>
                    <pre v-for="(mark, mindex) in data.data.remark" class="text-wrap" :key="mindex"
                    >{{ mark }}</pre>
                  </article>
                  <div class="h-full flex items-end pb-2">
                    <div class="flex border-t w-full pt-2 justify-start text-start gap-2">
                      <strong>ชำระผ่าน : </strong>
                      <span v-if="data.data.transfer ==='cash'">เงินสด</span>
                      <div class="flex flex-col" v-else>
                        <span>บัญชีธนาคาร {{ data.data.bank.remark_2 }} หมายเลข {{ data.data.bank?.status[0] }}</span>
                        <span>ชื่อบัญชี {{ data.data.bank?.name }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <table v-if="data.data.sumVat" class="h-full">
                    <tbody class="h-full">
                      <tr class="flex justify-between w-full">
                        <td v-if="data.data.isVat" class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ (ก่อน Vat)</span></td>
                        <td v-else class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                        <td v-if="data.data.isVat" class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price*100/107) }}</span>บาท</td>
                        <td v-else class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price) }}</span>บาท</td>
                      </tr>
                      <tr class="hidden justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">ส่วนลด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || 0 }}</span>บาท</td>
                      </tr>
                      <tr class="hidden justify-between w-full">
                        <td style="text-align: left"><span class="pl-5">ราคาหลังหักส่วนลด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+(data.data.project?.total || 0)-data.data.discount) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data?.isVat && vat > 0" class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price*7/107) }}</span>บาท</td>
                      </tr>
                      <tr v-else-if="data.data?.isVat && vat === 0" class="flex justify-between w-full">
                        <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat) }}</span>บาท</td>
                      </tr>
                      <tr v-if="data.data?.isVat" class="flex justify-between w-full pb-2">
                        <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price) }}</span>บาท</td>
                      </tr>
                      <tr class="hidden justify-between w-full pb-2" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left"><span class="pl-5 font-semibold">ยอดทั้งหมด</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price) }}</span>บาท</td>
                      </tr>
                      <tr class="hidden justify-between w-full pb-2" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left"><span class="pl-5">ยอดค้างก่อนชำระ</span></td>
                        <td style="text-align: right"><span class="pr-3">{{ 
                          
                          data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)+((data.data.project?.total || 0)*0.07)-data.data.discount+vat)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)-data.data.discount+vat+((data.data.project?.total || 0)*0.07))-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          
                          : data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)-data.data.discount-data.data.invoiceRef_detail?.paid+data.data.amount_price))
                          
                          : data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          : !data.data.vat.percen_deducted && !data.data?.isVat
                          ? formatCurrency((totalPrice+(data.data.project?.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid+data.data.amount_price)
                          
                          : '-'

                          }}
                        </span>บาท</td>
                      </tr>
                      <tr class="flex justify-between w-full py-2 border-t" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left"><strong class="pl-5">ยอดชำระ</strong></td>
                        <td style="text-align: right"><strong class="pr-3">{{ formatCurrency(data.data.amount_price) }}</strong>บาท</td>
                      </tr>
                      <tr class="hidden justify-between w-full pb-2" :style="{ backgroundColor: `#${data.color}` }">
                        <td style="text-align: left">
                          <span class="pl-5">
                            ยอดค้างสุทธิ
                          </span>
                        </td>
                        <td style="text-align: right"><span class="pr-3">
                            {{ 
                              data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))-data.data.invoiceRef_detail?.paid)
                              : !data.data.vat.percen_deducted && data.data?.isVat && data.data.sumVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount+vat+((data.data.project.total || 0)*0.07))-data.data.invoiceRef_detail?.paid)

                              : data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid)
                              : !data.data.vat.percen_deducted && data.data?.isVat && !data.data.sumVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid)

                              : data.data.vat.percen_deducted && !data.data?.isVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid)
                              : !data.data.vat.percen_deducted && !data.data?.isVat
                              ? formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.invoiceRef_detail?.paid)

                              : '-'
                            }}
                          </span>บาท
                        </td>
                      </tr>
                    </tbody>
                </table>
                
                <table v-if="!data.data.sumVat" class="h-full">
                  <tbody>
                    <tr class="hidden justify-between w-full">
                      <td v-if="data.data.isVat" class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ (ก่อน Vat)</span></td>
                      <td v-else class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                      <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+(data.data.project.total || 0)) }}</span>บาท</td>
                    </tr>
                    <tr class="hidden justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || 0 }}</span>บาท</td>
                    </tr>
                  
                    <tr class="hidden justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคาหลังหักส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data?.isVat" class="hidden justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat) }}</span>บาท</td>
                    </tr>
                    <tr v-if="data.data?.isVat" class="hidden justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice-data.data.discount+vat) }}</span>บาท</td>
                    </tr>
                    <tr class="hidden justify-between w-full pt-2 mt-2 border-t">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ยอดค้างก่อนชำระ</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency((totalPrice+(data.data.project.total || 0)-data.data.discount+vat)-(data.data.invoiceRef_detail.paid-data.data.amount_price)) }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ยอดชำระ</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.amount_price) }}</span>บาท</td>
                    </tr>
                    <tr class="flex justify-between w-full">
                      <td v-if="data.data.isVat" class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ (ก่อน Vat)</span></td>
                      <td v-else class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                      <td class="" style="text-align: right"><span class="pr-3">
                        {{ 
                          formatCurrency(data.data.amount_price-(vat/(parseInt(data.data.invoiceRef_detail?.period_text[2] || 1)))) 
                        }}
                      </span>บาท</td>
                    </tr>
                    <tr v-if="data.data?.isVat" class="flex justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat/(parseInt(data.data.invoiceRef_detail?.period_text[2] || 1))) }}</span>บาท</td>
                    </tr>
                    <tr class="hidden justify-between w-full">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ยอดคงเหลือ</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(Math.abs((totalPrice+(data.data.project.total || 0)-data.data.discount)-(data.data.invoiceRef_detail.paid))) }}</span>บาท</td>
                    </tr>
                    
                    <tr class="flex justify-between items-center w-full py-2 mt-2 bg-green-200 " :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left">
                        <div class="flex flex-col items-center">
                          <strong class="pl-5 text-md font-semibold">
                            ยอดชำระทั้งสิ้น
                          </strong>
                        </div>
                      </td>
                      <td style="text-align: right"><strong class="pr-3">{{ formatCurrency(data.data.amount_price) }}</strong>บาท</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="w-full min-w-[100px] h-fit min-h-[35px] bg-green-200 text-center py-2 border-b border-r border-l flex justify-center items-center"
              :style="{ backgroundColor: `#${data.color}` }">
              <p class="font-bold">
                ( {{ (formatNumberToText(data.data.amount_price) + 'ถ้วน').replace('สตางค์ถ้วน', 'สตางค์') }} )
              </p>
            </div>
              <tr v-if="data.data.vat.percen_deducted" class="flex justify-between items-center w-full border-b border-l border-r pt-2 pb-2" :style="{ backgroundColor: `#${data.color}` }">
                <td>
                </td>
                <td style="text-align: left">
                    <span class="pl-5 font-semibold">
                      มูลค่า ภาษีหัก ณ. ที่จ่าย {{ data.data.vat.percen_deducted }}  %<span class="px-2">{{ formatCurrency(withHolding) }}</span> บาท
                    </span>
                </td>
              </tr>
            </div>
          </div>
        <div class="flex justify-center px-2">
            <table>
                <tbody>
                  <tr>
                    <td class="border text-sm" style="text-align: center; padding:0;">ผู้รับเงิน</td>
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
                              ( {{ data.data.customer_detail.customer_contact_sign ? data.data.customer_detail.customer_contact_sign : data.data.customer_detail.customer_name }} )
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
import logoVat from '@/assets/img/ssgdc.jpg'
import logoNoVat from '@/assets/img/ssgd.png'

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
    return item.vat_price * item.product_amount
  })
  const result = all_vat.length > 0 ? all_vat.reduce((a,b) => a + b) : 0
  return result + data.data.project.vat_price
})

const withHolding = computed(()=>{
  const percent = data.data.vat.percen_deducted
  const result = data.data.isVat && vat.value > 0 ? (data.data.amount_price*100/107)*percent/100 : data.data.amount_price*percent/100
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

function formatNumber() {
  const inputElement = document.getElementById('numberInput');
  const formattedNumberElement = document.getElementById('formattedNumber');
  const number = parseFloat(inputElement.value);
  
  if (!isNaN(number)) {
    const formattedNumber = formatNumberToText(number);
    formattedNumberElement.textContent = formattedNumber;
  } else {
    formattedNumberElement.textContent = '';
  }
}

function formatNumberToText(number) {
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

  const integerPart = Math.floor(number);
  const decimalPart = (number - integerPart).toFixed(2).slice(-2);

  function convertIntegerToThaiText(num) {
    let result = "";
    let previousDigitWasZero = false;
    for (let i = 0; i < num.length; i++) {
      const digit = parseInt(num[i]);
      if (digit !== 0) {
        if (i === num.length - 2 && digit === 2 && !previousDigitWasZero) {
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

  const thaiIntegerText = convertIntegerToThaiText(integerPart.toString());
  const thaiDecimalText = convertDecimalToThaiText(decimalPart);

  const thaiText =
    thaiIntegerText +
    (thaiIntegerText !== "" ? "บาท" : "") +
    (decimalPart !== "00" ? thaiDecimalText + "สตางค์" : "");

  return thaiText || "ศูนย์บาท";
}

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
    background-color: rgb(187 247 208 / var(--tw-bg-opacity));
}

.total {
  margin-top: 0px;
  text-align: right;
}
.mt-5 {
    margin-top: 5px;
  }

</style>
