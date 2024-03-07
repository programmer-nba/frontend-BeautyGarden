<template>
    <div class="col-span-12 grid grid-cols-12">
        <div class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12 border-t">
                <div class="text-center text-xs flex items-center justify-center">
                    <p class="opacity-0 text-white">divider</p>
                </div>
                <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                </div>
                <div class="col-span-4 grid grid-cols-4">
                    
                    <div class="border-r border-r-black grid grid-cols-2">
                        <div class="border-r border-r-black">
                        </div>
                        <div>
                        </div>
                    </div>
                    
                    <div class="border-r border-r-black grid grid-cols-2">
                        <div class="border-r border-r-black">
                        </div>
                        <div>
                        </div>
                    </div>
                    
                    <div class="border-r border-r-black">

                    </div>
                    
                    <div>

                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12">
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="text-center text-xs flex items-center justify-center">
                        <p class="py-1">{{ no ? no : '' }}</p>
                    </div>
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <p class="text-xs py-1 font-bold">ค่าใช้จ่ายในการจัดทำเล่ม</p>
                    </div>
                    <div class="col-span-4 grid grid-cols-4">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black">
                            </div>
                            <div>
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black text-xs flex justify-center items-center">
                                <p>{{ data?.freq > 0 ? data.freq : '-' }}</p>
                            </div>
                            <div class="text-xs flex justify-center items-center">
                                <p>{{ data?.freq_unit }}</p>
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center">
                            <p style="font-size: 10px;">{{ data?.unit_price > 0 ? formatCurrency(data?.unit_price) : '-' }}</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center">
                            <p style="font-size: 10px;">{{ data?.total_price > 0 ? formatCurrency(data?.total_price) : '-' }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="text-center text-xs flex items-center justify-center">
                    </div>
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <p class="text-xs py-1 font-bold">รายละเอียดดังนี้</p>
                    </div>
                    <div class="col-span-4 grid grid-cols-4">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black">
                            </div>
                            <div>
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black">
                            </div>
                            <div>
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black">

                        </div>
                        <!--จำนวนเงิน-->
                        <div>

                        </div>
                    </div>
                </div>
            </div>
            <!--Value-->
            <div class="col-span-12 grid grid-cols-12">
                <!--รายละเอียด-->
                <div class="col-span-12 grid grid-cols-12">
                    <!--v-for-->
                    <div v-for="(detail, index) in data?.detail" :key="index" class="col-span-12 grid grid-cols-12 border-t">
                        <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                            <div class="col-span-12 grid grid-cols-7">
                                <div class="col-span-7 pl-1" style="font-size: 12px;">
                                    {{ detail ? detail : '-' }}
                                </div> 
                            </div>
                        </div>
                        <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                            <!--จำนวน-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ความถี่-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ราคา/หน่วย-->
                            <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                            <!--จำนวนเงิน-->
                            <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                        </div>
                    </div>
                </div>
                <!--รายละเอียดการส่งเล่ม-->
                <div class="col-span-12 grid grid-cols-12">
                    <div class="col-span-12 grid grid-cols-12 border-t">
                        <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                            <div class="col-span-12 grid grid-cols-7">
                                <div class="col-span-7 font-bold" style="font-size: 12px;">
                                    รายละเอียดของการส่งเล่ม
                                </div> 
                            </div>
                        </div>
                        <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                            <!--จำนวน-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ความถี่-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ราคา/หน่วย-->
                            <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                            <!--จำนวนเงิน-->
                            <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                        </div>
                    </div>
                    <!--v-for-->
                    <div v-for="(sent, index) in data?.sent" :key="index" class="col-span-12 grid grid-cols-12 border-t">
                        <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                            <div class="col-span-12 grid grid-cols-7">
                                <div class="col-span-7 pl-1" style="font-size: 12px;">
                                    {{ sent ? sent : '-' }}
                                </div> 
                            </div>
                        </div>
                        <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                            <!--จำนวน-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ความถี่-->
                            <div class="border-r border-r-black grid grid-cols-2">
                                <div class="border-r border-r-black flex justify-center items-center">
                                    
                                </div>
                                <div class="flex justify-center items-center">
                                    
                                </div>
                            </div>
                            <!--ราคา/หน่วย-->
                            <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                            <!--จำนวนเงิน-->
                            <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12 border-t">
                <div class="text-center text-xs flex items-center justify-center">
                    <p class="opacity-0 text-white">divider</p>
                </div>
                <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                </div>
                <div class="col-span-4 grid grid-cols-4">
                    
                    <div class="border-r border-r-black grid grid-cols-2">
                        <div class="border-r border-r-black">
                        </div>
                        <div>
                        </div>
                    </div>
                    
                    <div class="border-r border-r-black grid grid-cols-2">
                        <div class="border-r border-r-black">
                        </div>
                        <div>
                        </div>
                    </div>
                    
                    <div class="border-r border-r-black">

                    </div>
                    
                    <div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { data, no } = defineProps(['data', 'no'])

function formatCurrency(value) {
    
    if (typeof value !== 'number' || isNaN(value)) {
        return 'Invalid Number'
    }

    return value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}


</script>