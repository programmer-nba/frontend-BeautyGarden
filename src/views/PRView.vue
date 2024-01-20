<template>
    <div>
        <div class="flex bg-green-700 justify-center items-center has-imgbk">
            <div class="flex flex-col">
                <div class="flex gap-2">
                    <span class="text-white font-bold text-8xl">Beauty</span>
                    <span class="text-green-300 font-bold text-8xl">Garden</span>
                </div>
                <div class="self-center py-5">
                    <p class="text-4xl font-semibold text-green-200">บ้านสวนสวยการ์เดนท์ ♥</p>
                </div>
            </div>
        </div>
        <div class="z-10 py-5">
            <SlidePictures/>
        </div>
        
        <div class="w-full h-[400px] border-black border-2 bg-white flex justify-center relative">
            <img class="absolute left-0 top-0" src="/plant-01.png" alt="plant-01">
            <div class="p-36 h-fit self-center border rounded-lg bg-green-200">
                <h1>บริการของเรา</h1>
            </div>
        </div>

        <div class="w-full h-[400px] bg-slate-200 flex justify-end items-end">
            <img class="z-20" src="/plant-02.png" alt="plant-02">
        </div>
    </div>
</template>
<script setup>
import SlidePictures from '@/components/pr/SlidePictures.vue';

</script>
<style scoped>
.has-imgbk {
    background-image: url('');
    background-size: cover;       
    background-position: center;  
    background-repeat: no-repeat;
    width: 100%;                 
    height: 600px;  
}
</style>