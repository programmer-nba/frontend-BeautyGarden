<template>
    <div class="col-span-12 grid grid-cols-12 border-t border-b border-t-black border-b-black">
        <!--Left-->
        <div class="col-span-7">
            <div class="grid grid-rows-6 gap-y-1 py-1">
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">เรียน</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-7 pl-1">
                        {{ data?.customer_name }}
                    </div>
                </div>
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">บริษัท</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-7 pl-1">
                        {{ data?.customer_company }}
                    </div>
                </div>
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">ที่อยู่</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-7 pl-1">
                        {{ data?.customer_address }}
                    </div>
                </div>
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">โทรศัพท์</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-3 pl-1">{{ data?.customer_tel }}</div>
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">โทรสาร</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-3 pl-1">{{ data?.customer_fax }}</div>
                </div>
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-1">
                        <div class="flex justify-between">
                            <p class="font-bold pl-1">Email</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-7 pl-1">{{ data?.customer_email }}</div>
                </div>
                <div class="grid grid-cols-8">
                    <div class="text-xs col-span-8">
                        <p class="font-bold pl-1">สถานที่เก็บตัวอย่าง <span class="font-normal"> : {{ data?.sample_location }}</span></p>
                    </div>
                    
                </div>
            </div>
        </div>
        <!--Right-->
        <div class="col-end-13 col-span-4 border-l border-l-black">
            <div class="grid grid-rows-6 gap-y-1 py-1 px-1">
                <div class="grid grid-cols-6">
                    <div class="text-xs col-span-2">
                        <div class="flex justify-between">
                            <p class="font-bold">เลขที่/No.</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-2">{{ data?.document_no }}</div>
                </div>
                <div class="grid grid-cols-6">
                    <div class="text-xs col-span-2">
                        <div class="flex justify-between">
                            <p class="font-bold">วันที่/Date</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-2">{{ formatDateToCustom(data?.document_date) }}</div>
                </div>
                <div class="grid grid-cols-6">
                    <div class="text-xs col-span-2">
                        <div class="flex justify-between">
                            <p class="font-bold">ผู้เสนอราคา</p>
                            <p class="px-1">:</p>
                        </div>
                    </div>
                    <div class="text-xs col-span-2">{{ data?.offerer }}</div>
                </div>
                <div class="grid grid-cols-6">
                    <div class="text-xs col-span-6">
                        <div>
                            <p class="font-bold">
                                เลขประจำตัวผู้เสียภาษี
                                <span class="font-normal">: {{ data?.offerer_tax_id }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { data } = defineProps(['data'])

function formatDateToCustom(dateString) {
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = (date.getFullYear()+543).toString().slice(-2);

    if(!dateString || !date || !day || !month || !year) return '-'

    return `${day}-${month}-${year}`;
}
</script>

<style scoped></style>