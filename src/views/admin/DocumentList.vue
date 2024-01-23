<template>
    <div class="flex flex-wrap mt-4">
      <div class="w-full mb-12 px-4">
        <CardReceipts color="dark" />
      </div>
    </div>
  </template>
  <script>
  import CardReceipts from "@/components/Cards/CardReceipts.vue";
  
  export default {
    components: {
        CardReceipts,
    },
  };
  </script>
  