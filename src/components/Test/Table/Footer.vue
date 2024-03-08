<template>
    <div class="col-span-12 grid grid-cols-12">
        <!--Customer Request-->
        <div class="col-span-9 border-r border-r-black grid grid-cols-8">
            <div class="text-xs font-bold pl-1 col-span-10 py-1">
                <p class="py-1">คำขอและข้อตกลงลูกค้า</p>
                <div class="flex flex-col gap-y-2 py-1 border-t font-normal">
                    <div class="grid grid-cols-12">
                        <div class="col-span-3">
                            <p>1. วิธีการทดสอบ</p>
                        </div>
                        <div class="col-span-3 flex gap-1 items-center pl-2">
                            <div class="border border-black w-4 h-4"
                                :class="data?.test_method === 'labroom' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>ห้องปฎิบัติการ S.P.J.</p>
                        </div>
                        <div class="col-span-2 flex gap-1 items-center">
                            <div class="border w-4 h-4 border-black"
                                :class="data?.test_method === 'custom' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>ลูกค้ากำหนด</p>
                        </div>
                        <div class="col-span-4 flex gap-1 items-center">
                            <div class="border border-black w-4 h-4"
                                :class="!['labroom', 'custom'].includes(data?.test_method) ? 'bg-black' : ''"
                            >
                            </div>
                            <p>อื่น ๆ ระบุ 
                                <span v-if="!['labroom', 'custom'].includes(data?.test_method)" class="underline decoration-1 decoration-dashed text-center px-1">{{ data.test_method }}</span>
                                <span v-else>......</span>
                            </p>
                        </div>
                    </div>
                    <div class="grid grid-cols-12">
                        <div class="col-span-3">
                            <p>2. วิธีการแจ้งผล</p>
                        </div>
                        <div class="col-span-3 flex gap-1 items-center pl-2">
                            <div class="border border-black w-4 h-4"
                                :class="data?.report_method === 'agent' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>ตัวแทนบริษัท</p>
                        </div>
                        <div class="col-span-2 flex gap-1 items-center">
                            <div class="border w-4 h-4 border-black"
                                :class="data?.report_method === 'email' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>E-mail</p>
                        </div>
                        <div class="col-span-2">
                            <div class="flex gap-1 items-center">
                                <div class="border w-4 h-4 border-black"
                                :class="data?.report_method === 'post' ? 'bg-black' : ''"
                                >
                                </div>
                                <p>ไปรษณีย์</p>
                            </div>
                        </div>
                        <div class="col-span-2 flex gap-1 items-center pl-2">
                            <div class="border border-black w-4 h-4"
                                :class="!['agent', 'email', 'post'].includes(data?.report_method) ? 'bg-black' : ''"
                            >
                            </div>
                            <p>อื่น ๆ ระบุ 
                                <span v-if="!['agent', 'email', 'post'].includes(data?.report_method)" class="underline decoration-1 decoration-dashed text-center px-1">{{ data?.report_method }}</span>
                                <span v-else>......</span>
                            </p>
                        </div>
                    </div>
                    <div class="grid grid-cols-12">
                        <div class="col-span-3">
                            <p>3. การจัดทำรายงาน</p>
                        </div>
                        <div class="col-span-5 flex gap-1 items-center pl-2">
                            <div class="border border-black w-4 h-4"
                                :class="data?.report_detail === 'asdetail' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>ดังรายละเอียดของการส่งเล่มรายงาน</p>
                        </div>
                        <div class="col-span-4 flex gap-1 items-center">
                            <div class="border border-black w-4 h-4"
                                :class="data?.report_detail !== 'asdetail' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>อื่น ๆ ระบุ 
                                <span v-if="data?.report_detail !== 'asdetail'" class="underline decoration-1 decoration-dashed text-center px-1">{{ data?.report_detail }}</span>
                                <span v-else>......</span>
                            </p>
                        </div>
                    </div>
                    <div class="grid grid-cols-12">
                        <div class="col-span-3">
                            <p>4. ส่งรายงาน</p>
                        </div>
                        <div class="col-span-3 flex gap-1 items-center pl-2">
                            <div class="border border-black w-4 h-4"
                                :class="data?.report_transfer === 'agent' ? 'bg-black' : ''"
                            >
                            </div>
                            <p>ตัวแทนบริษัท</p>
                        </div>
                        <div class="col-span-2 flex justify-between items-center">
                            <div class="flex gap-1 items-center">
                                <div class="border w-4 h-4 border-black"
                                :class="data?.report_transfer === 'post' ? 'bg-black' : ''"
                                >
                                </div>
                                <p>ไปรษณีย์</p>
                            </div>
                        </div>
                        <div class="col-span-4 flex gap-1 items-center">
                            <div class="border border-black w-4 h-4"
                                :class="!['agent', 'post'].includes(data?.report_transfer) ? 'bg-black' : ''"
                            >
                            </div>
                            <p>อื่น ๆ ระบุ 
                                <span v-if="!['agent', 'post'].includes(data?.report_transfer)" class="underline decoration-1 decoration-dashed text-center px-1">{{ data.report_transfer }}</span>
                                <span v-else>......</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--Price-->
        <div class="col-span-3 grid grid-cols-8 text-xs">
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">รวมเป็นเงิน</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.total_price || 0) }}</p>
                </div>
            </div>
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">ส่วนลด</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.total_discount || 0) }}</p>
                </div>
            </div>
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">คงเหลือ</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency((data.total_price || 0)-(data.total_discount || 0)) }}</p>
                </div>
            </div>
            <div v-if="!data?.hidden?.includes('service_price')" class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">ค่าดำเนินการ</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.service_price || 0) }}</p>
                </div>
            </div>
            <div v-if="!data?.hidden?.includes('report_price')" class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">ค่าจัดทำรายงาน</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.report_price || 0) }}</p>
                </div>
            </div>
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">จำนวนเงินรวมก่อน Vat</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">
                        {{ 
                            formatCurrency(
                                (data.total_price || 0)
                                - (data.total_discount || 0)
                                + (data.service_price || 0)
                                + (data.report_price || 0)
                            ) 
                        }}
                    </p>
                </div>
            </div>
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black border-b border-b-black py-1">
                    <p class="font-bold pl-1">ภาษีมูลค่าเพิ่ม 7%</p>
                </div>
                <div class="col-span-2 pr-1 border-b border-b-black">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.vat_price || 0) }}</p>
                </div>
            </div>
            <div class="col-span-8 grid grid-cols-6">
                <div class="col-span-4 border-r border-r-black py-1">
                    <p class="font-bold pl-1">จำนวนเงินรวมทั้งสิ้น</p>
                </div>
                <div class="col-span-2 pr-1">
                    <p class="text-end py-1" style="font-size: 10px;">{{ formatCurrency(data.net_price || 0) }}</p>
                </div>
            </div>
        </div>
        <div class="col-span-12 border-t py-2 text-center text-sm font-bold border-t-black bg-gray-300">
            <p>{{ formatNumberToText(data.net_price || 0) }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

let { data } = defineProps(["data"])

function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) {
        return '-'
    }

    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

function formatNumberToText (number) {
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
    ]
    const thaiPlaces = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"]

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
        return result
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
    (thaiIntegerText !== "" ? "บาทถ้วน" : "") +
    thaiDecimalText +
    (thaiDecimalText !== "" ? "สตางค์" : "");

    return thaiText || "ศูนย์บาท";
}

</script>