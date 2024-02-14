<template>
    <div class="w-full">
        <Card @click.prevent="choose" class="hover:shadow-blue-200 hover:shadow-md cursor-pointer">
            <template #title>ใบแจ้งหนี้</template>
            <template #content>
                <p class="m-0">
                    จำนวน {{ In.invoicesAmount }} ใบ
                </p>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { useInvoiceStore } from '@/stores/invoice'
import { ref, onMounted } from 'vue'

const In = useInvoiceStore()

onMounted(async()=>{
    await In.getInvoices()
})

const emit = defineEmits(['choose'])

const choose = () => {
    emit('choose')
}

</script>

<style scoped>

</style>