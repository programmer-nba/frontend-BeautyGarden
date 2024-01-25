<template>
    <div class="flex flex-wrap mt-4">
      <div class="w-full mb-12 px-4">
        <card-quotations color="dark" />
      </div>
      <div class="w-full mb-12 px-4">
        <card-invoices color="light" />
      </div>
      <div v-if="isVat" class="w-full mb-12 px-4">
        <card-receipts color="dark" @changeToNoVat="isVat = !isVat"/>
      </div>
      <div v-if="!isVat" class="w-full mb-12 px-4">
        <CardNoVatReceipts color="dark" @changeToVat="isVat = !isVat"/>
      </div>
    </div>
  </template>
  <script>
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
  