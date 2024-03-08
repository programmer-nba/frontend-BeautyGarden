<template>
    <div class="grid grid-cols-12 py-5">
        <div class="col-span-5 flex justify-center items-center px-5">
            <div class="flex flex-col justify-center items-center py-3 px-5 w-full border border-black text-sm">
                <p class="pb-5">อนุมัติสั่งซื้อ/สั่งจ้างตามรายการข้างต้น</p>
                <p>ลงชื่อ (__________________________)</p>
                <p>วันที่......./......./.......</p>
            </div>
        </div>
        <div class="col-span-7">
            <div class="flex flex-col justify-center items-center py-3 px-5 w-full text-sm">
                <p class="pb-5">จึงเรียนมาเพื่อพิจารณาและขอขอบพระคุณมา ณ โอกาสนี้</p>
                <p class="text-xs pb-2">.............................................................................</p>
                <p>( {{ data.name }} <span class="text-xs">{{ data.tel }}</span> ) / {{ data.position }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
let { data } = defineProps(["data"])
</script>