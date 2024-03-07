<template>
    <div class="grid grid-cols-12 border gap-y-2">
        <div class="col-span-12 grid grid-cols-12">
            <div class="col-span-2">
                <div class="flex justify-center items-center">
                    <Image :src="Logo" alt="logo1" preview imageClass="rounded-full scale-125 relative top-2"
                        imageStyle="width: 80px;" />
                </div>
            </div>
            <div class="col-span-4">
                <div class="h-full flex flex-col justify-center">
                    <p class="text-xs font-bold text-green-900">
                        บริษัท เอส.พี.เจ. ไซแอนติฟิค จำกัด
                    </p>
                    <p class="text-xs font-bold text-green-900">
                        S. P. J. SCIENTIFIC COMPANY LIMITED
                    </p>
                </div>
            </div>

            <div class="col-end-12 col-span-5">
                <div class="flex flex-col gap-1 justify-start px-2 py-3 items-end h-full text-xs text-end font-semibold"
                    style="font-size: 9.5px; line-height: 1rem">
                    <p>80 ซอยนักกีฬาแหลมทอง 3 แขวงทับช้าง เขตสะพานสูง กรุเทพฯ 10250</p>
                    <p style="font-size: 8.5px; line-height: 1rem">
                        80 Soi Nakkilalaemthong 3, Thap Chang, Saphansoong, Bangkok 10250
                    </p>
                    <p style="font-size: 8.5px; line-height: 1rem">
                        โทร : 0 2735-7520-2 โทรสาร : 0 2735 7238 E-maiil : spj.sci@gmail.com
                    </p>
                </div>
            </div>
            <div>
                <div class="flex justify-center items-center">
                    <Image :src="Logo2" alt="logo2" preview imageClass="relative top-3 scale-100" imageStyle="width: 100px;" />
                </div>
            </div>
        </div>
        <div class="col-span-12 grid grid-cols-12">
            <div class="col-start-6 col-span-2">
                <div class="flex flex-col justify-center items-center font-bold -mt-2 h-full">
                    <p>ใบเสนอราคา</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Logo from "@/assets/img/LOGO_lab.jpg"
import Logo2 from '@/assets/img/LOGO2_lab.jpg'
</script>

<style scoped>

</style>