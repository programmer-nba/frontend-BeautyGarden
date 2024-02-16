<template>
   
    <Dialog v-model:visible="open" modal :header="invoice.invoice" :style="[{ width: 'auto' }, { height: 'auto' }]">
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
                    <tr v-for="rep in invoice.end_period" :key="rep">
                        <td>
                            RE20240217000{{ rep }}
                        </td>
                        <td>
                            17/02/2567
                        </td>
                        <td>
                            5,000
                        </td>
                        <td>
                            งวดที่ {{ rep }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Dialog>
    
</template>

<script setup>
import axios from "axios"
import { ref, watchEffect } from "vue"

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