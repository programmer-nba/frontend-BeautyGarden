<template>
    <div class="flex flex-col mt-4">
      <button class="px-2 bg-black text-white" @click.prevent="showTable">switch</button>
      <div class="w-full mb-12 px-4" style="z-index:1000;">
        <card-quotations color="light" />
      </div>
      <div v-if="isVat" class="w-full mb-12 px-4">
        <card-receipts color="dark" @changeToNoVat="isVat = !isVat"/>
      </div>
      <!-- <div v-if="!isVat" class="w-full mb-12 px-4">
        <CardNoVatReceipts color="dark" @changeToVat="isVat = !isVat"/>
      </div> -->
      <!-- <div class="w-full mb-12 px-4">
        <card-invoices color="light" />
      </div> -->
    </div>
  </template>
  <script>
  /* eslint-disable */
  import CardReceipts from "@/components/Cards/CardReceipts.vue";
  import CardNoVatReceipts from "@/components/Cards/CardNoVatReceipts.vue";
  import CardInvoices from "@/components/Cards/CardInvoices.vue";
  import CardQuotations from "@/components/Cards/CardQuotations.vue";
  
  export default {
    components: {
        CardReceipts,
        CardInvoices,
        CardQuotations,
        CardNoVatReceipts
    },
    data() {
      return {
        isVat: true
      }
    },
  };
  </script>
  