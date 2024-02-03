<template>
    <div class="flex flex-col mt-4">
      <div class="w-full mb-12 px-4">
        <card-quotations color="light" />
      </div>
      <div class="w-full mb-12 px-4">
        <card-invoices color="dark"/>
      </div>
      <div v-if="isVat" class="w-full mb-12 px-4">
        <card-receipts color="dark"/>
      </div>
    </div>
  </template>
  <script>
  /* eslint-disable */
  import CardReceipts from "@/components/Cards/CardReceipts.vue";
  import CardInvoices from "@/components/Cards/CardInvoices.vue";
  import CardQuotations from "@/components/Cards/CardQuotations.vue";
  
  export default {
    components: {
        CardReceipts,
        CardInvoices,
        CardQuotations,
    },
    data() {
      return {
        isVat: true
      }
    },
  };
  </script>
  