<template>
  <div class="flex flex-wrap mt-4">
    <div class="w-full mb-12 px-4">
      <CardCustomers />
    </div>
  </div>
</template>
<script>
import CardCustomers from "@/components/Cards/CardCustomers.vue";

export default {
  components: {
    CardCustomers,
  },
};
</script>
