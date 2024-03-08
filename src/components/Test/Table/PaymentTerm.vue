<template>
    <div class="grid grid-cols-12 gap-y-2 pl-1 border-t border-t-black py-1">
        <div class="col-span-full">
            <p class="font-bold underline text-sm">เงื่อนไขการชำระเงิน</p>
        </div>
        <div v-for="(term, index) in data" class="col-span-full">
            <p class="text-xs">
                {{ index + 1 }}. {{ term }}
            </p>
        </div>
    </div>
</template>

<script setup>
let { data } = defineProps(["data"])
</script>