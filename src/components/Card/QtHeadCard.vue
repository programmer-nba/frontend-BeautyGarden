<template>
    <div class="w-full">
        <Card @click.prevent="choose" class="hover:shadow-yellow-200 hover:shadow-md cursor-pointer">
            <template #title>ใบเสนอราคา</template>
            <template #content>
                <p class="m-0">
                    จำนวน {{ qt.quotationsAmount }} ใบ
                </p>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { useQuotationStore } from '@/stores/quotation'
import { ref, onMounted } from 'vue'

const qt = useQuotationStore()

onMounted(async()=>{
    await qt.getQuotations()
})

const emit = defineEmits(['choose'])

const choose = () => {
    emit('choose')
}

</script>

<style scoped>

</style>