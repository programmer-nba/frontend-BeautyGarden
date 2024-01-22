<template>
  <div class="mt-12">

    <RegularModal/>

    <div class="flex flex-wrap mt-4">
      <div class="w-full mb-12 px-4">
        <card-table-account color="dark" />
      </div>
    </div>

    <RegularModal/>

    <button class="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
      Regular
    </button>
    <button class="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
      Regular
    </button>
    <button class="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
      Regular
    </button>
    <button class="bg-teal-500 text-white active:bg-teal-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button">
      Regular
    </button>

    

    

  </div>
  
</template>
<script>
import CardTableAccount from "@/components/Cards/CardTableAccount.vue";
import RegularModal from "@/components/Modals/RegularModal.vue";

export default {
  components: {
    CardTableAccount,
    RegularModal
  },
};
</script>
