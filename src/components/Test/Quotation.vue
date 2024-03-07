<template>
    <div>
        <div class="flex justify-center w-full border items-start">
            <div class="border border-black w-[210mm] min-h-[297mm] bg-white">
                <!--Header-->
                <div class="grid grid-cols-12 border gap-y-2">
                    <div class="col-span-12 grid grid-cols-12">
                        <div class="col-span-2">
                            <div class="flex justify-center items-center">
                                <Image :src="Logo" alt="logo" preview imageClass="rounded-full relative top-2" imageStyle="width: 110px;" />
                            </div>
                        </div>
                        <div class="col-span-4">
                            <div class="h-full flex flex-col justify-center">
                                <p class="text-sm font-bold text-green-900">บริษัท เอส.พี.เจ. ไซแอนติฟิค จำกัด</p>
                                <p class="text-sm font-bold text-green-900">S. P. J. SCIENTIFIC COMPANY LIMITED</p>
                            </div>
                        </div>
                        
                        <div class="col-end-12 col-span-5">
                            <div class="flex flex-col gap-1 justify-start px-2 py-3 items-end h-full text-xs text-end font-semibold" style="font-size: 9.5px; line-height: 1rem;">
                                <p>80 ซอยนักกีฬาแหลมทอง 3 แขวงทับช้าง เขตสะพานสูง กรุเทพฯ 10250</p>
                                <p style="font-size: 8.5px; line-height: 1rem;">80 Soi Nakkilalaemthong 3, Thap Chang, Saphansoong, Bangkok 10250</p>
                                <p style="font-size: 8.5px; line-height: 1rem;">โทร : 0 2735-7520-2 โทรสาร : 0 2735 7238 E-maiil : spj.sci@gmail.com</p>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-center items-center">
                                <Image :src="Logo2" alt="logo" preview imageStyle="width: 100px;" />
                            </div>
                        </div>
                    </div>
                    <div class="col-span-12 grid grid-cols-12">
                        <div class="col-start-6 col-span-2">
                            <div class="flex flex-col justify-center items-center font-bold -mt-3 h-full">
                                <p>ใบเสนอราคา</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!--SubHead-->
                <div class="col-span-12 grid grid-cols-12 border-t border-b border-t-black border-b-black">
                    <!--Left-->
                    <div class="col-span-7">
                        <div class="grid grid-rows-6 gap-y-1 py-1">
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-1">
                                    <div class="flex justify-between">
                                        <p class="font-bold">เรียน</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-7">นิติบุคคลอาคารชุดโคปาคาบาน่า บีช จอมเทียน</div>
                            </div>
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-1">
                                    <div class="flex justify-between">
                                        <p class="font-bold">บริษัท</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-7">นิติบุคคลอาคารชุดโคปาคาบาน่า บีช จอมเทียน</div>
                            </div>
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-1">
                                    <div class="flex justify-between">
                                        <p class="font-bold">ที่อยู่</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-7">551/5 ม.12 ต.หนองปรือ อ.บางละมุง จ.ชลบุรี 20150</div>
                            </div>
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-1">
                                    <div class="flex justify-between">
                                        <p class="font-bold">โทรศัพท์</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-7">097-928-8623</div>
                            </div>
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-1">
                                    <div class="flex justify-between">
                                        <p class="font-bold">Email</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-7">cbjcondojuristicperson@gmail.com</div>
                            </div>
                            <div class="grid grid-cols-8">
                                <div class="text-xs col-span-2">
                                    <div class="flex justify-between">
                                        <p class="font-bold">สถานที่เก็บตัวอย่าง</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-6">นิติบุคคลอาคารชุดโคปาคาบาน่า บีช จอมเทียน</div>
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
                                <div class="text-xs col-span-2">QT6701003</div>
                            </div>
                            <div class="grid grid-cols-6">
                                <div class="text-xs col-span-2">
                                    <div class="flex justify-between">
                                        <p class="font-bold">วันที่/Date</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-2">3-Jan-67</div>
                            </div>
                            <div class="grid grid-cols-6">
                                <div class="text-xs col-span-2">
                                    <div class="flex justify-between">
                                        <p class="font-bold">ผู้เสนอราคา</p>
                                        <p class="px-1">:</p>
                                    </div>
                                </div>
                                <div class="text-xs col-span-2">QT6701003</div>
                            </div>
                            <div class="grid grid-cols-6">
                                <div class="text-xs col-span-6">
                                    <div>
                                        <p class="font-bold">เลขประจำตัวผู้เสียภาษี <span class="font-normal">: 0105548132830</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--Body head-->
                <div class="col-span-12 grid grid-cols-12 border-b border-b-black">
                    <!--Left-->
                    <div class="col-span-8">
                        <div class="grid grid-cols-8 gap-y-1 text-center font-semibold">
                            <div class="text-xs border-r border-r-black">
                                <p>ลำดับ</p>
                            </div>
                            <div class="text-xs col-span-3 border-r border-r-black">
                                รายละเอียดโครงการ
                            </div>
                            <div class="text-xs col-span-4 border-r border-r-black">
                                วิธีการวิเคราะห์
                            </div>
                        </div>
                    </div>
                    <!--Right-->
                    <div class="col-span-4">
                        <div class="grid grid-cols-8 gap-y-1 text-center font-semibold">
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>จำนวน</p>
                            </div>
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>ความถี่</p>
                            </div>
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>ราคา/หน่วย</p>
                            </div>
                            <div class="text-xs col-span-2">
                                <p>จำนวนเงิน</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!--Body-->
                <div class="col-span-12 grid grid-cols-12 border-b border-b-black">
                    <!--Left-->
                    <div class="col-span-8">
                        <div class="grid grid-cols-8 gap-y-1 text-center font-semibold">
                            <div class="text-xs border-r border-r-black">
                                <p>ลำดับ</p>
                            </div>
                            <div class="text-xs col-span-3 border-r border-r-black">
                                รายละเอียดโครงการ
                            </div>
                            <div class="text-xs col-span-4 border-r border-r-black">
                                วิธีการวิเคราะห์
                            </div>
                        </div>
                    </div>
                    <!--Right-->
                    <div class="col-span-4">
                        <div class="grid grid-cols-8 gap-y-1 text-center font-semibold">
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>จำนวน</p>
                            </div>
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>ความถี่</p>
                            </div>
                            <div class="text-xs col-span-2 border-r border-r-black">
                                <p>ราคา/หน่วย</p>
                            </div>
                            <div class="text-xs col-span-2">
                                <p>จำนวนเงิน</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from '@/assets/img/LOGO_lab.jpg'
import Logo2 from '@/assets/img/LOGO2_lab.jpg'
</script>

<style scoped>

</style>
