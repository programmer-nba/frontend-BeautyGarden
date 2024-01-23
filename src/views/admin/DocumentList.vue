<template>
    <div class="flex flex-wrap mt-4">
      <div class="w-full mb-12 px-4">
        <CardReceipts color="dark" />
      </div>
      <div class="w-full mb-12 px-4">
        <card-invoices color="dark" />
      </div>
    </div>
  </template>
  <script>
  import CardReceipts from "@/components/Cards/CardReceipts.vue";
  import CardInvoices from "@/components/Cards/CardInvoices.vue";
  
  export default {
    components: {
        CardReceipts,
        CardInvoices
    },
  };
  </script>
  