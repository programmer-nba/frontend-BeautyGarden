<template>
    <div>
        <Checkbox 
            class="bg-green-400 w-6 h-6 rounded text-green-900 text-center font-bold pl-1.5"
            :value="true"
            v-model="data"
        />
        {{ data[0] }}
    </div>
</template>

<script setup>
import { ref } from "vue"
import Checkbox from 'primevue/checkbox';

const data = ref()

</script>

<style scoped>

</style>