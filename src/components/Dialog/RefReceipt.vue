<template>
   
    <Dialog v-model:visible="open" modal :header="`${invoice.invoice} จ่ายแล้ว ${invoice.paid}`" :style="[{ width: 'auto' }, { height: 'auto' }]">
        <div class="w-full border">
            <table class="border w-full">
                <thead>
                    <th class="border">
                        <td>
                            เลขที่ใบเสร็จ
                        </td>
                    </th>
                    <th>
                        <td>
                            วันที่
                        </td>
                    </th>
                    <th>
                        <td>
                            จำนวนเงิน
                        </td>
                    </th>
                    <th>
                        <td>
                            หมายเหตุ
                        </td>
                    </th>
                </thead>
                <tbody>
                    <tr v-for="rep in invoice.status" :key="rep.receipt">
                        <td>
                            {{ rep.receipt }}
                        </td>
                        <td>
                            {{ formatThaiDate(rep.createdAt) }}
                        </td>
                        <td>
                            {{ formatCurrency(rep.paid) || 0 }}
                        </td>
                        <td>
                            งวดที่ {{ rep.period }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Dialog>
    
</template>

<script setup>
import { ref, watchEffect } from "vue"
import { formatThaiDate } from "@/functions/DateTime"
import { formatCurrency } from "@/functions/Currency"

const { invoice } = defineProps(["invoice"])
const open = ref(true)
const emits = defineEmits(["open_close"])

watchEffect(()=>{
    emits("open_close", open.value)
})

</script>

<style lang="scss" scoped>
th {
    border: 1px solid black;
    padding: 0px 2rem;
}

tr td {
    border: 1px solid black;
    padding: 1rem 2rem;
}
</style>