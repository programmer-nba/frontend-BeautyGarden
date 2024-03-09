<template>
    <div class="grid grid-cols-4 w-full border gap-2">
        <div class="col-start-2 bg-emerald-700 rounded-lg">
            <form>
                <!--subhead-->
                <div ref="subhead" class="my-5 mx-5 bg-white/80 rounded-lg">
                    <div class="flex flex-col gap-y-8 py-8 w-full items-center">
                        <div class="flex items-center gap-5">
                            <p class="text-center font-bold text-lg text-emerald-800">ลูกค้า</p>
                            <div class="card flex justify-center max-w-lg">
                                <Dropdown @change="selectedCustomer" v-model="customer" :options="customers" filter optionLabel="name_tax" showClear placeholder="เลือกลูกค้า" class="w-full md:w-14rem">
                                    <template #value="slotProps">
                                        <div v-if="slotProps.value" class="flex items-center">
                                            <div>{{ slotProps.value.name }}</div>
                                        </div>
                                        <span v-else>
                                            {{ slotProps.placeholder }}
                                        </span>
                                    </template>
                                    <template #option="slotProps">
                                        <div class="flex items-center">
                                            <div class="flex flex-col">
                                                <p class="text-sm font-bold">{{ slotProps.option.name }}</p>
                                                <small>{{ slotProps.option.tax_id }}</small>
                                            </div>
                                        </div>
                                    </template>
                                </Dropdown>
                            </div>
                            <Button v-tooltip.top="'เพิ่มลูกค้าใหม่'" icon="pi pi-plus-circle text-3xl text-white hover:text-orange-500 duration-300" class="bg-orange-500 hover:bg-white py-1 px-2 hover:shadow-md hover:ring-1 hover:ring-orange-300 hover:scale-125 ease-in-out duration-300 transition-transform" />
                        </div>
                        
                        <div class="card grid grid-cols-4">
                            <label for="customer_name" class="text-lg text-center text-emerald-800">เรียน : </label>
                            <InputText class="col-span-3 px-3" id="customer_name" v-model="quotation.subhead.customer_name" />
                        </div>
                        <div class="card grid grid-cols-4">
                            <label for="customer_company" class="text-lg text-center text-emerald-800">บริษัท : </label>
                            <InputText class="col-span-3 px-3" id="customer_company" v-model="quotation.subhead.customer_company" />
                        </div>
                        <div class="card grid grid-cols-4">
                            <label for="customer_address" class="text-lg text-center text-emerald-800">ที่อยู่ : </label>
                            <InputText class="col-span-3 px-3" id="customer_address" v-model="quotation.subhead.customer_address" />
                        </div>
                        <div class="card grid grid-cols-4">
                            <label for="customer_tel" class="text-lg text-center text-emerald-800">โทรศัพท์ : </label>
                            <InputMask mask="099-999-9999" class="col-span-3 px-3" id="customer_tel" v-model="quotation.subhead.customer_tel" />
                        </div>
                        <div class="card grid grid-cols-4">
                            <label for="customer_fax" class="text-lg text-center text-emerald-800">โทรสาร : </label>
                            <InputText class="col-span-3 px-3" id="customer_fax" v-model="quotation.subhead.customer_fax" />
                        </div>
                    </div>
                </div>
            </form>
        </div>
        
        <Quotatioin class="col-span-2" :quotation="quotation" />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Quotatioin from "@/components/Test/Quotation.vue"
import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import InputMask from 'primevue/inputmask'
import InputText from 'primevue/inputtext'
import Tooltip from 'primevue/tooltip'

const quotation = ref({
    subhead: {
        customer_name: "กรรมการผู้จัดการ",
        customer_company: "บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด (โรงพยาบาล บี.แคร์ เมดิคอลเซ็นเตอร์)",
        customer_address: "29 ม.6 ถ.พหลโยธิน แขวงสายไหม เขตสายไหม กรุงเทพ 10220",
        customer_tel: "",
        customer_fax: "",
        sample_lacation: "โรงพยาบาล บี.แคร์ เมดิคอลเซ็นเตอร์",
        document_no: "QT-2024020001",
        document_date: new Date(),
        offerer: "ศุภาพรรณ 080-897-8376",
        offerer_tax_id: "0105548132830"
    },
    bodies: [
        {
            duration: {
                start_month: new Date().getMonth(),
                start_year: new Date().getYear(),
                end_month: new Date().getMonth(),
                end_year: new Date().getYear()
            },
            title: "ตรวจคุณภาพน้ำทิ้ง ระหว่างเดือนมกราคม - ธันวาคม 2567",
            subtitles: [
                {
                    subtitle: "ตรวจคุณภาพน้ำทิ้ง จำนวน 7 จุด",
                    analysis: "ตรวจคุณภาพน้ำทิ้ง",
                    total_amount_points: 7,
                    details: [
                        {
                            points: [
                                "ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)",
                                "บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด"
                            ],
                            frequency: 4,
                            frequency_text: "3 เดือน/ครั้ง",
                            collect_month: ["Feb", "May", "Aug", "Nov"],
                            collect_year: "2567",
                            amount_point: 2,
                            // dropdown set
                            params: [
                                {
                                    name: "pH",
                                    method: "Electrometric Method (4500-H+ B)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 100,
                                    total_price: 800,
                                    discount: 398,
                                    cost: 49.75
                                },
                                {
                                    name: "BOD",
                                    method: "Membrane Electrode Method (4500-O G)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 400,
                                    total_price: 3200,
                                    discount: 1592,
                                    cost: 199
                                }
                            ],
                        }
                    ]
                }
            ],
            isReport: false,
            report: {
                freq: 0,
                freq_unit: 0,
                unit_price: 0,
                total_price: 0,
                detail: [ "1. ส่งผลวิเคราะห์ Analysis report / รายเดือน", "2.จัดทำเล่มรายงานผลการปฎิบัติตามมาตรการ EIA" ],
                sent: [
                    " ระหว่างมกราคม - มิถุนายน 2567",
                    "ระหว่างกรกฎาคม - ธันวาคม 2567",
                    "- ต้นฉบับสี 1 ชุด  และ สำเนาสี จำนวน 2 ชุด แผ่น นำส่งเล่มรายงานต่อ อธิบดีกรมสนับสนุนบริการสุขภาพ",
                    "- สำเนาสี 1 ฉบับ ,สำเนาขาวดำ 1 ฉบับ / CD 2 แผ่น นำส่ง บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด(รพ.บี.แคร์ เมดิคอลเซ็นเตอร์) และยื่นรายงานในระบบอิเล็กทรอนิกส์ของสำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม"
                ]
            }
        },
        {
            title: "ตรวจคุณภาพน้ำทิ้ง ระหว่างเดือนมกราคม - ธันวาคม 2567",
            subtitles: [
                {
                    subtitle: "ตรวจคุณภาพน้ำทิ้ง จำนวน 7 จุด",
                    details: [
                        {
                            points: [
                                "ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)",
                                "บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด"
                            ],
                            params: [
                                {
                                    name: "pH",
                                    method: "Electrometric Method (4500-H+ B)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 100,
                                    total_price: 800,
                                },
                                {
                                    name: "BOD",
                                    method: "Membrane Electrode Method (4500-O G)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 400,
                                    total_price: 3200,
                                }
                            ]
                        }
                    ]
                }
            ],
            isReport: true,
            report: {
                freq: 2,
                freq_unit: "ครั้ง",
                unit_price: 10000,
                total_price: 20000,
                detail: [ "1. ส่งผลวิเคราะห์ Analysis report / รายเดือน", "2.จัดทำเล่มรายงานผลการปฎิบัติตามมาตรการ EIA" ],
                sent: [
                    " ระหว่างมกราคม - มิถุนายน 2567",
                    "ระหว่างกรกฎาคม - ธันวาคม 2567",
                    "- ต้นฉบับสี 1 ชุด  และ สำเนาสี จำนวน 2 ชุด แผ่น นำส่งเล่มรายงานต่อ อธิบดีกรมสนับสนุนบริการสุขภาพ",
                    "- สำเนาสี 1 ฉบับ ,สำเนาขาวดำ 1 ฉบับ / CD 2 แผ่น นำส่ง บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด(รพ.บี.แคร์ เมดิคอลเซ็นเตอร์) และยื่นรายงานในระบบอิเล็กทรอนิกส์ของสำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม"
                ]
            }
        }
    ],
    footer: {
        test_method: "labroom",
        report_method: "email",
        report_detail: "asdetail",
        report_transfer: "agent",
        hidden: [],
        total_price: 75000,
        total_discount: 5000,
        service_price: 10000,
        report_price: 20000,
        vat_price: 7000,
        net_price: 107000
    },
    // dropdown set
    payment_term: [
        "ชำระเงินแบ่งเป็น 2 งวด คิดเป็นงวดละ 50%  วางบิลพร้อมเล่ม รายงาน EIA",
        "กรณีไม่ชำระเงินตามเงื่อนไข ทางบริษัทฯสามารถยกเลิกงานดังกล่าวได้",
        "ระยะเวลาส่งผลวิเคราะห์ไม่เกิน 15 วัน หลังจากวันตรวจวัด",
        "กรณีไปถึงหน้างานแล้วไม่สามารถเก็บตัวอย่างได้ ทางบริษัทฯขอเรียกเก็บค่าบริการ 2,000 บาท",
        "ทางบริษัทฯขอสงวนสิทธิ์ในการเก็บเงินตามใบเสนอราคาหากลูกค้ามีการลดปริมาณงานลดลง"
    ],
    // dropdown set
    signature: {
        name: "ประภาพร",
        tel: "081-904-6891",
        position: "ผู้จัดการ"
    },
    status: [
        {
            name: "new",
            text: "รอแอดมินตรวจสอบ",
            sender: {
                name: "มานพ",
                code: "SALE-01"
            },
            createdAt: new Date()
        }
    ],
})

const customer = ref({})
function selectedCustomer () {
    quotation.value.subhead.customer_name = customer.value?.name
    quotation.value.subhead.customer_tel = customer.value?.tel
    quotation.value.subhead.customer_address = customer.value?.address
    quotation.value.subhead.customer_fax = customer.value?.fax
    quotation.value.subhead.customer_company = customer.value?.company
}

const customers = ref([
    {
        name: "บริษัท ABC จำกัด",
        company: "บริษัท ABC จำกัด",
        tax_id: "1234567890123",
        name_tax: "บริษัท ABC จำกัด (1234567890123)",
        address: "12/2 กรุงเทพ",
        tel: "087-555-5555",
        fax: "-",
        email: "abc@gmail.com"
    },
    {
        name: "นิติบุคคล เคียงมอ",
        company: "นิติบุคคล เคียงมอ",
        tax_id: "0000055555000",
        name_tax: "นิติบุคคล เคียงมอ (0000055555000)",
        address: "345 เชียงใหม่ สุเทพ 50300",
        tel: "089-999-9999",
        fax: "-",
        email: "km@gmail.com"
    }
])
</script>