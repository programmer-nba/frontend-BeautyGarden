<template>
    <div class="col-span-12 grid grid-cols-12">
        <!--Head-->
        <div class="col-span-12 grid grid-cols-12 border-t">
            <div class="text-center text-xs flex items-center justify-center">
                <p class="py-1">{{ no ? no : '' }}</p>
            </div>
            <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                <p class="text-xs font-bold py-1">{{ data?.subtitle }}</p>
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
        <!--Sub Head (v-for)-->
        <div v-for="(detail, index) in data?.details" class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12">
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="text-center text-xs flex items-center justify-center">
                        <p class="py-1">{{ no }}.{{ index + 1 || '' }}</p>
                    </div>
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <!--v-for-->
                        <p v-for="(point, pointIndex) in detail?.points" class="text-xs py-1" :key="pointIndex">{{ point }}</p>
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
                <!--v-for-->
                <div v-for="(param, paramIndex) in detail?.params" class="col-span-12 grid grid-cols-12 border-t" :key="paramIndex">
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <div class="col-span-12 grid grid-cols-7">
                            <div class="col-span-3 border-r border-r-black">
                                <p class="text-xs py-1 pl-1">{{ param?.name }}</p>
                            </div>
                            <div class="col-span-4 text-center">
                                <p class="text-xs py-1">{{ param?.method }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>{{ param?.amount }}</p>
                            </div>
                            <div class="flex justify-center items-center">
                                {{ param?.amount_unit }}
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>{{ param?.freq }}</p>
                            </div>
                            <div class="flex justify-center items-center">
                                {{ param?.freq_unit }}
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ param?.unit_price }}</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ param?.total_price }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const { data, no } = defineProps(["data", "no"])
</script>