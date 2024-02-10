<template>
    <div class="w-full">
        <Card @click.prevent="choose" class="hover:shadow-green-200 hover:shadow-md cursor-pointer">
            <template #title>ใบเสร็จรับเงิน</template>
            <template #content>
                <p class="m-0">
                    จำนวน {{ re.receiptsAmount }} ใบ
                </p>
            </template>
        </Card>
    </div>
</template>

<script setup>
import { useReceiptStore } from '@/stores/receipt'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const re = useReceiptStore()

onMounted(async()=>{
    await re.getReceipts()
})

const emit = defineEmits(['choose'])

const choose = () => {
    emit('choose')
}
</script>

<style scoped>

</style>