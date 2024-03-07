<template>
    <div class="col-span-12 grid grid-cols-12">
        <!--Head-->
        <div class="col-span-12 grid grid-cols-12 border-t">
            <div class="text-center text-xs flex items-center justify-center">
                <p class="py-1">1</p>
            </div>
            <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                <p class="text-xs font-bold py-1">ตรวจคุณภาพน้ำทิ้ง จำนวน 7 จุด</p>
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
        <div class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12">
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="text-center text-xs flex items-center justify-center">
                        <p class="py-1">1.1</p>
                    </div>
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <!--v-for-->
                        <p class="text-xs py-1">ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)</p>
                        <p class="text-xs py-1">บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด</p>
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
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <div class="col-span-12 grid grid-cols-7">
                            <div class="col-span-3 border-r border-r-black">
                                <p class="text-xs py-1 pl-1">pH</p>
                            </div>
                            <div class="col-span-4 text-center">
                                <p class="text-xs py-1">Electrometric Method (4500-H+ B)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>2</p>
                            </div>
                            <div class="flex justify-center items-center">
                                จุด
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>4</p>
                            </div>
                            <div class="flex justify-center items-center">
                                ครั้ง
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>100.00</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>800.00</p>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <div class="col-span-12 grid grid-cols-7">
                            <div class="col-span-3 border-r border-r-black">
                                <p class="text-xs py-1 pl-1">BOD</p>
                            </div>
                            <div class="col-span-4 text-center">
                                <p class="text-xs py-1">Membrane Electrode Method (4500-O G)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>2</p>
                            </div>
                            <div class="flex justify-center items-center">
                                จุด
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>4</p>
                            </div>
                            <div class="flex justify-center items-center">
                                ครั้ง
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ '400.00' }}</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ '3,200.00' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-span-12 grid grid-cols-12">
            <!--title-->
            <div class="col-span-12 grid grid-cols-12">
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="text-center text-xs flex items-center justify-center">
                        <p class="py-1">1.2</p>
                    </div>
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <!--v-for-->
                        <p class="text-xs py-1">ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)</p>
                        <p class="text-xs py-1">บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด</p>
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
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <div class="col-span-12 grid grid-cols-7">
                            <div class="col-span-3 border-r border-r-black">
                                <p class="text-xs py-1 pl-1">pH</p>
                            </div>
                            <div class="col-span-4 text-center">
                                <p class="text-xs py-1">Electrometric Method (4500-H+ B)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>2</p>
                            </div>
                            <div class="flex justify-center items-center">
                                จุด
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>4</p>
                            </div>
                            <div class="flex justify-center items-center">
                                ครั้ง
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>100.00</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>800.00</p>
                        </div>
                    </div>
                </div>
                <div class="col-span-12 grid grid-cols-12 border-t">
                    <div class="col-start-2 col-end-9 border-b-black border-l border-l-black border-r border-r-black text-start">
                        <div class="col-span-12 grid grid-cols-7">
                            <div class="col-span-3 border-r border-r-black">
                                <p class="text-xs py-1 pl-1">BOD</p>
                            </div>
                            <div class="col-span-4 text-center">
                                <p class="text-xs py-1">Membrane Electrode Method (4500-O G)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 grid grid-cols-4 text-xs text-center">
                        <!--จำนวน-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>2</p>
                            </div>
                            <div class="flex justify-center items-center">
                                จุด
                            </div>
                        </div>
                        <!--ความถี่-->
                        <div class="border-r border-r-black grid grid-cols-2">
                            <div class="border-r border-r-black flex justify-center items-center">
                                <p>4</p>
                            </div>
                            <div class="flex justify-center items-center">
                                ครั้ง
                            </div>
                        </div>
                        <!--ราคา/หน่วย-->
                        <div class="border-r border-r-black flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ '400.00' }}</p>
                        </div>
                        <!--จำนวนเงิน-->
                        <div class="flex justify-end pr-1 items-center" style="font-size: 10px;">
                            <p>{{ '3,200.00' }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>