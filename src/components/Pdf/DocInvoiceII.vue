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
                    v-if="data.data.customer_branch?.isVat"
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
                  โทร : {{ data.data.customer_branch?.Branch_company_number }}<br />
                  อีเมลล์ : {{ data.data.customer_branch?.company_email }}
                  <br />
                  <span v-if="data.data.customer_branch?.isVat">เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_branch?.taxnumber }}</span><br />
                  <br />
                  <span class="font-bold">ลูกค้า</span><br />
                  <p>{{ data.data.customer_detail?.customer_name }} {{ 
                    data.data.customer_detail?.customer_lastname && data.data.customer_detail?.customer_lastname!=='undefined' 
                    ? '(' + data.data.customer_detail?.customer_lastname + ')'
                    : null 
                  }}</p>
                  <p>{{ data.data.customer_detail?.customer_address !== 'undefined' ? data.data.customer_detail?.customer_address : '' }}</p>
                  <p>{{ data.data.customer_detail?.customer_email !== 'undefined' ? data.data.customer_detail?.customer_email : null }}</p>
                  <span v-if="data.data.customer_branch?.isVat">
                    เลขประจำตัวผู้เสียภาษี TAX ID : {{ data.data.customer_detail?.tax_id !== 'undefined' ? data.data.customer_detail?.tax_id : '' }}
                  </span><br /><br />
                </div>
                <div class="from">
                  <span
                    v-if="!data.data.customer_branch?.isVat"
                    class="text-xs w-full text-center font-semibold inline-block py-2 px-2 rounded text-black bg-sky-200 uppercase last:mr-0 mr-1"
                    :style="{ backgroundColor: `#${data.color}` }"
                    >
                    {{ data.data.selectedChild.header || data.data.header }}
                  </span>
                  <span
                    v-if="data.data.customer_branch?.isVat"
                    class="text-xs w-full text-center font-semibold inline-block py-2 px-2 rounded text-black bg-sky-200 uppercase last:mr-0 mr-1"
                    :style="{ backgroundColor: `#${data.color}` }"
                    >
                    {{ data.data.header }}
                  </span>
                  <br />
                  <br />
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">เลขที่ : </span>
                    {{ data.data.selectedChild.code.replace('undefined', '1') }}/{{ data.data.end_period }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">วันที่ Date : </span>
                    {{ formatDate(data.data.selectedChild.start_date) || '-' }}
                  </div>
                  <div class="hidden justify-between">
                    <span class="font-bold pr-4">เครดิต</span>
                    {{ data.data.credit > 0 ? data.data.credit : '-' }} วัน
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">วันครบกำหนด Date due : </span>
                    {{ formatDate(data.data.selectedChild.end_date) || '-' }}
                  </div>
                  <div class="flex justify-between">
                    <span class="font-bold pr-4">อ้างอิง :</span>
                    {{ data.data.quotation || '-' }}
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

              <table class="border-b min-h-[80px] h-full">
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
                      <p>งวดที่</p>
                      <small class="font-normal">Period</small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>ราคา/หน่วย</p>
                      <small class="font-normal">Unit Price</small>
                    </th>
                    <th v-if="data.data.isVat" :style="{ backgroundColor: `#${data.color}` }" class="th border pb-0 pt-2" style="text-align: center">
                      <p>VAT 7%</p>
                      <small class="font-normal"></small>
                    </th>
                    <th :style="{ backgroundColor: `#${data.color}` }" class="th pb-0 pt-2 border rounded-tr-xl" style="text-align: center">
                      <p>จำนวนเงิน</p>
                      <small class="font-normal">Amount Price</small>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="data.data.childs.length > 0" class="border">
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center h-full py-2 font-bold">
                        โครงการ project
                      </div>
                    </td>
                    <td class=".td border" style="text-align: start">
                      <div class="flex justify-start font-bold h-full py-2">
                        {{ data.data.project.name }}
                      </div>
                      <div class="flex justify-start h-full">
                        {{ data.data.selectedChild.remark || "-" }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div v-if="!data.data.selectedChild" class="flex justify-center h-full py-2">
                        {{ data.data.project.amount?.toLocaleString() }} {{ data.data.project.unit }}
                      </div>
                      <div v-else class="flex justify-center items-center h-full py-2">
                        {{ data.data.selectedChild.period }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div v-if="!data.data.selectedChild" class="flex justify-center h-full py-2">
                        <pre class="hidden">
                          {{
                            data.data.sumVat 
                            ? data.data.project.vat_price = data.data.project?.price*0.07 
                            : data.data.project.vat_price = data.data.project?.price*7/107
                          }}
                        </pre>
                        {{ 
                          data.data.sumVat ? formatCurrency(data.data.project?.price)
                          : formatCurrency(data.data.project?.price-data.data.project?.vat_price)
                        }}
                      </div>
                      <div v-else class="flex items-center justify-center h-full py-2">
                        {{ 
                          data.data.customer_branch?.isVat && vat > 0 ? formatCurrency(data.data.selectedChild.price*100/107) : formatCurrency(data.data.selectedChild.price)
                        }}
                      </div>
                    </td>
                    <td v-if="data.data.customer_branch?.isVat" class=".td border" style="text-align: center">
                      <div v-if="!data.data.selectedChild" class="flex justify-center h-full py-2">
                        <pre class="hidden">{{ 
                            data.data.project.isVat && data.data.sumVat 
                            ? data.data.project.vat_price = data.data.project.total*0.07 
                            : data.data.project.isVat && !data.data.sumVat 
                            ? data.data.project.vat_price = data.data.project.total*7/107
                            : data.data.project.vat_price = 0 
                          }}
                        </pre>
                        {{ data.data.customer_branch?.isVat ? formatCurrency(data.data.project.vat_price) : '0.00' }}
                      </div>
                      <div v-else class="flex justify-center items-center h-full py-2">
                        {{ data.data.customer_branch?.isVat && vat > 0 ? formatCurrency(data.data.selectedChild.price*7/107) : formatCurrency(vat) }}
                      </div>
                    </td>
                    <pre class="hidden">
                      {{ 
                        data.data.project.isVat && data.data.sumVat 
                        ? data.data.project.total_net = data.data.project.total + data.data.project.vat_price
                        : data.data.project.isVat && !data.data.sumVat
                        ? data.data.project.total_net = data.data.project.total
                        : data.data.project.total_net = data.data.project.total
                      }}
                    </pre>
                    <td class=".td border" style="text-align: center">
                      <div v-if="!data.data.selectedChild" class="flex justify-center h-full py-2">
                        {{ formatCurrency(data.data.project.total_net) }}
                      </div>
                      <div v-else>
                        {{ formatCurrency(data.data.selectedChild.price) }}
                      </div>
                    </td>
                  </tr>
                  <tr v-if="data.data.childs.length === 0" class="border" v-for="(product, index) in data.data.product_detail" :key="index">
                    <td class=".td flex justify-center" style="text-align: center">
                      <p v-if="product.product_name">
                        {{ product.product_no }}
                      </p>
                      <p v-else>
                        
                      </p>
                    </td>
                    <td class=".td border">
                      <div class="flex flex-col">
                        <article class="text-wrap w-[350px]">
                            <p class="pb-3 font-bold hidden">{{ product.product_name }}</p>
                            <p class="hidden" v-for="(p, pindex) in product.product_text" style="text-align: left" :key="pindex">
                              {{ p }}
                            </p>
                            <p class="py-2" style="text-align: left">
                              {{ data.data.selectedChild.remark }}
                            </p>
                            <div class="hidden flex-wrap">
                              <img 
                              v-for="(img, imgIndex) in product.product_logo" :key="imgIndex"
                              class="w-[100px] object-contain" 
                              :src="`${img}`" 
                              :alt="imgIndex" 
                              />
                            </div>
                        </article>
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center h-full py-2"
                        :class="product.product_amount < 1 ? 'hidden' : ''"
                      >
                        {{ data.data.selectedChild.period }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div v-if="data.data.customer_branch?.isVat" class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ formatCurrency(data.data.selectedChild.price*100/107) }}
                      </div>
                      <div v-else class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ formatCurrency(data.data.selectedChild.price) }}
                      </div>
                    </td>
                    <td v-if="data.data.customer_branch?.isVat" class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ 
                          formatCurrency(data.data.selectedChild.price*7/107)
                        }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ formatCurrency(data.data.selectedChild.price) }}
                      </div>
                    </td>
                    
                  </tr>
                  <tr v-if="data.data.childs.length > 0" class="border hidden" v-for="(product, index) in data.data.product_detail" :key="index">
                    <td class=".td flex justify-center" style="text-align: center">
                      <p>
                        {{ data.data.selectedChild.period  }}
                      </p>
                    </td>
                    <td class=".td border">
                      <div class="flex flex-col">
                        <article class="text-wrap w-[350px]">
                            <p class="pb-3 font-bold hidden">{{ product?.product_name }}</p>
                            <p class="hidden" v-for="(p, pindex) in product?.product_text" style="text-align: left" :key="pindex">
                              {{ p }}
                            </p>
                            <p class="py-2" style="text-align: left">
                              {{ data.data.selectedChild.remark }}
                            </p>
                            <div class="hidden flex-wrap">
                              <img 
                              v-for="(img, imgIndex) in product?.product_logo" :key="imgIndex"
                              class="w-[100px] object-contain" 
                              :src="`${img}`" 
                              :alt="imgIndex" 
                              />
                            </div>
                        </article>
                      </div>
                    </td>
                    <td class=".td border" style="text-align: center">
                      <div class="flex justify-center h-full py-2"
                        :class="product.product_amount < 1 ? 'hidden' : ''"
                      >
                        {{ data.data.selectedChild.period }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div v-if="data.data.customer_branch?.isVat && vat > 0" class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        <!-- {{vat}} -->
                        <!-- {{ formatCurrency(data.data.selectedChild.price*100/107) }} -->
                        {{ formatCurrency(data.data.selectedChild.price-(data.data.selectedChild.price*7/107)) }}
                      </div>
                      <div v-else class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ formatCurrency(data.data.selectedChild.price) }}
                      </div>
                    </td>
                    <td v-if="data.data.customer_branch?.isVat" class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      v-if="!data.data.sumVat && vat > 0"
                      >
                        {{ 
                          formatCurrency(data.data.selectedChild.price*7/107)
                        }}
                      </div>
                      <div class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      v-else
                      >
                        {{ 
                          formatCurrency(vat)
                        }}
                      </div>
                    </td>
                    <td class=".td border" style="text-align: right">
                      <div class="flex justify-center h-full py-2"
                      :class="product.product_price < 1 ? 'hidden' : ''"
                      >
                        {{ formatCurrency(data.data.selectedChild.price) }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex w-full justify-between total border-r border-l border-b">
                <div class="flex flex-col border-r">
                  <article class="text-wrap w-[413px] min-h-[50px] text-start pr-5">
                    <strong>หมายเหตุ :</strong>
                    <pre v-for="(mark, mindex) in data.data.remark" class="text-wrap" :key="mindex"
                    >{{ mark }}</pre>
                  </article>
                  
                  <div class="flex flex-col border-t py-2">
                    <h1 class="text-md font-bold text-start">
                      ช่องทางการชำระเงิน :
                    </h1>
                    <div v-if="data.data.transfer === 'cash'" class="text-start flex flex-col w-full">
                      <span>เงินสด</span>
                    </div>
                    <div v-else class="text-start flex flex-col w-full">
                      <span>ธนาคาร {{ data.data.bank?.remark_2 ? data.data.bank?.remark_2 : '.......' }} เลขบัญชี {{ data.data.bank?.status ? data.data.bank?.status : '.........' }}  </span>
                      <span>ชื่อบัญชี {{ data.data.bank?.name ? data.data.bank?.name : '.........' }}</span>
                    </div>
                  </div>
                </div>
                
                <table class="h-full">
                  <tbody class="h-full">
                    <tr class="flex justify-between w-full pb-1">
                      <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                      <td class="" style="text-align: right"><span class="pr-3">
                        {{ 
                          data.data.customer_branch?.isVat && vat > 0 ? formatCurrency(data.data.selectedChild.price*100/107) : formatCurrency(data.data.selectedChild.price) 
                        }}</span>บาท
                      </td>
                    </tr>
                    
                    <tr class="hidden justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount) || '0.00' }}</span>บาท</td>
                    </tr>
                    <tr class="hidden justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคาหลังหักส่วนลด</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ 
                        formatCurrency(totalPrice+(data.data.project.total || 0)-data.data.discount) 
                      }}</span>บาท</td>
                    </tr>
                    
                    <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                      <td style="text-align: right" v-if="vat > 0"><span class="pr-3">{{ formatCurrency(data.data.selectedChild.price*7/107) }}</span>บาท</td>
                      <td style="text-align: right" v-else><span class="pr-3">{{ formatCurrency(vat) }}</span>บาท</td>
                    </tr>

                    <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                      <td style="text-align: right"><span class="pr-3">
                        {{ 
                          formatCurrency(data.data.selectedChild.price) 
                        }}
                      </span>บาท</td>
                    </tr>

                    <tr class="hidden justify-between w-full pb-1">
                      <td style="text-align: left"><span class="pl-5 font-semibold">ชำระมาแล้ว</span></td>
                      <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.prev_paid) }}</span>บาท</td>
                    </tr>

                    <tr class="hidden justify-between items-center w-full py-2 bg-sky-200 " :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left">
                        <div class="flex flex-col items-center">
                          <strong class="pl-5 font-semibold">
                            ยอดชำระทั้งสิ้น
                          </strong>
                        </div>
                      </td>
                      <td style="text-align: right">
                        <strong class="pr-3" v-if="data.data?.project?.isVat">
                          {{ 
                            formatCurrency(totalPrice+(data.data.project.total || 0)
                            -data.data.discount
                            +(vat+(data.data.project.vat_price || 0))-data.data.prev_paid) 
                          }}
                        </strong>
                        <strong class="pr-3" v-else>
                          {{ 
                            formatCurrency(totalPrice+(data.data.project.total || 0)
                            -data.data.discount-data.data.prev_paid
                            ) 
                          }}
                        </strong>
                        บาท
                      </td>
                    </tr>

                    <tr class="flex justify-between items-center w-full py-2 bg-sky-200 " :style="{ backgroundColor: `#${data.color}` }">
                      <td style="text-align: left">
                        <div class="flex flex-col items-center">
                          <strong class="pl-5 font-semibold">
                            ยอดชำระทั้งสิ้น
                          </strong>
                        </div>
                      </td>
                      <td style="text-align: right">
                        <strong class="pr-3">
                          {{ 
                            formatCurrency(data.data.selectedChild.price)
                          }}
                        </strong>
                        บาท
                      </td>
                    </tr>
                  </tbody>
                </table>
              
              <table class="hidden" v-if="!data.data.sumVat">
                <tbody>
                  
                  <tr class="flex justify-between w-full pb-1">
                    <td class="self-start" style="text-align: left; padding:0;"><span class="pl-5 font-semibold">ราคาสินค้า/บริการ</span></td>
                    <td class="" style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+(data.data.project.total || 0)-(data.data.project.vat_price || 0)) }}</span>บาท</td>
                  </tr>
                  <tr class="flex justify-between w-full pb-1">
                    <td style="text-align: left"><span class="pl-5 font-semibold">ส่วนลด</span></td>
                    <td style="text-align: right"><span class="pr-3">{{ formatCurrency(data.data.discount)}}</span>บาท</td>
                  </tr>
                  
                  <tr class="flex justify-between w-full pb-1">
                    <td style="text-align: left"><span class="pl-5 font-semibold">ราคาหลังหักส่วนลด</span></td>
                    <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+((data.data.project.total || 0)-(data.data.project.vat_price|| 0))-data.data.discount) }}</span>บาท</td>
                  </tr>
                  <tr v-if="data.data?.customer_branch?.isVat && data.data.project?.isVat" class="flex justify-between w-full pb-1">
                    <td style="text-align: left"><span class="pl-5 font-semibold">VAT 7%</span></td>
                    <td style="text-align: right"><span class="pr-3">{{ formatCurrency(vat+(data.data.project.vat_price || 0)) }}</span>บาท</td>
                  </tr>
                  <tr v-if="data.data?.customer_branch?.isVat" class="flex justify-between w-full pb-1">
                    <td style="text-align: left"><span class="pl-5 font-semibold">ราคารวม VAT 7%</span></td>
                    <td style="text-align: right"><span class="pr-3">{{ formatCurrency(totalPrice+((data.data.project.total || 0)-(data.data.project.vat_price || 0))-data.data.discount+vat+(data.data.project.vat_price || 0)) }}</span>บาท</td>
                  </tr>
                  
                  <tr class="flex justify-between w-full pb-2 pt-2" :style="{ backgroundColor: `#${data.color}` }">
                    <td style="text-align: left"><strong class="pl-5">จำนวนเงินทั้งสิ้น</strong></td>
                    <td style="text-align: right">
                      <strong class="pr-3">{{ formatCurrency(totalPrice-data.data.discount+vat+(data.data.project.total_net || 0)-data.data.prev_paid) }}</strong>
                      บาท
                    </td>
                  </tr>
                  <tr class="flex justify-between items-center w-full py-2 bg-sky-200 " :style="{ backgroundColor: `#${data.color}` }">
                    <td style="text-align: left">
                      <div class="flex flex-col items-center">
                        <strong class="pl-5 font-semibold">
                          จำนวนเงินทั้งสิ้น
                        </strong>
                      </div>
                    </td>
                    <td style="text-align: right">
                      <strong class="pr-3">
                        {{ formatCurrency(totalPrice-data.data.discount+vat+(data.data.project.total_net || 0)-data.data.prev_paid) }}
                      </strong>
                      บาท
                    </td>
                  </tr>
                </tbody>
              </table>

              </div>
            </div>
          </div>
          <div class="w-full min-w-[100px] h-fit min-h-[30px] bg-sky-200 text-center py-2 border-b border-l border-r flex justify-center items-center"
              :style="{ backgroundColor: `#${data.color}` }">
              <p class="font-bold hidden">
                ( {{ 
                  data.data.customer_branch?.isVat
                  ? formatNumberToText((totalPrice+(data.data.project.total_net || 0)-data.data.discount+vat)-data.data.prev_paid).replace('หนึ่งบาท', 'เอ็ดบาท') + 'ถ้วน' 
                  : formatNumberToText((totalPrice+(data.data.project.total || 0)-data.data.discount)-data.data.prev_paid).replace('หนึ่งบาท', 'เอ็ดบาท') + 'ถ้วน'
                }} )
              </p>
              <p class="font-bold">
                ( {{ 
                  !formatNumberToText(data.data.selectedChild.price).includes('สตางค์')
                  ? formatNumberToText(data.data.selectedChild.price).replace('หนึ่งบาท', 'เอ็ดบาท') + 'ถ้วน'
                  : formatNumberToText(data.data.selectedChild.price).replace('หนึ่งบาท', 'เอ็ดบาท')
                }} )
              </p>
          </div>
          <tr v-if="data.data.vat?.percen_deducted" class="flex justify-end text-sm py-2 pr-2 border-b border-r border-l font-semibold w-full">
            <td style="text-align: left"><span class="pl-5">หัก ณ ที่จ่าย ({{ data.data.vat?.percen_deducted }}%)</span></td>
            <td style="text-align: right"><span class="pr-3">{{ formatCurrency((data.data.vat?.percen_deducted/100)*(data.data.selectedChild.price*100/107)) }}</span>บาท</td>
          </tr>
        
          <div class="flex justify-center px-2">
            <table>
                <tbody>
                  <tr>
                    <td class="border text-sm" style="text-align: center; padding:0;">{{ data.data.footer1 || 'ผู้เสนอราคา' }}</td>
                    <td class="border text-sm" style="text-align: center; padding:0;">{{ data.data.footer2 || 'ผู้อนุมัติการสั่งซื้อ' }}</td>
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

                          <p v-if="!data.data.showCustomerName">
                            {{``}}
                          </p>
                          <p class="break-words max-w-[300px]" v-else>
                            ( {{ data.data.customer_detail.customer_contact_sign ? data.data.customer_detail.customer_contact_sign : data.data.customer_detail.customer_name }} )
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
    return (item.vat_price || 0) * item.product_amount
  })
  const result = all_vat.length > 0 ? all_vat.reduce((a,b) => a + b) : 0
  //const vats = result + data.data.project.vat_price
  return result
})

const withHolding = computed(()=>{
  const percent = data.data.vat.percen_deducted
  const price = 
    data.data.sumVat ? totalPrice.value + (data.data.project.total || 0) - data.data.discount
    : totalPrice.value + (data.data.project.total || 0) - (data.data.project.vat_price || 0) - data.data.discount
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
    return result.replace("ร้อยหนึ่งสิบ", "ร้อยสิบ");
  }

  function convertDecimalToThaiText(num) {
  let result = "";
  const tensDigit = parseInt(num[0]);
  const onesDigit = parseInt(num[1]);
  if (tensDigit !== 0) {
    if (tensDigit === 1) {
      result += onesDigit !== 0 ? "สิบ" : "";
    } else if (tensDigit === 2) {
      result += "ยี่สิบ";
    } else {
      result += thaiNumerals[tensDigit] + "สิบ";
    }
  }
  if (onesDigit !== 0 && tensDigit !== 1) {
    result += thaiNumerals[onesDigit];
  }
  console.log(result)
  return result;
  }

  const thaiIntegerText = convertIntegerToThaiText(integerPart.toString());
  const thaiDecimalText = decimalPart === "00" ? "" : convertDecimalToThaiText(decimalPart);

  const thaiText =
    thaiIntegerText +
    (thaiIntegerText !== "" ? "บาท" : "") +
    (decimalPart !== "00" ? thaiDecimalText + "สตางค์" : "");

  return thaiText || "ศูนย์บาท";
}

const data = defineProps(['data', 'color', 'header', 'isSign'])

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
  if (!isoDateString) return
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
  background-color: rgb(186 230 253 / var(--tw-bg-opacity));
}

.total {
  margin-top: 0px;
  text-align: right;
}
.mt-5 {
    margin-top: 5px;
  }

</style>
