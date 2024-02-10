<template>
  <div class="flex flex-col justify-center items-center">
    <DocQuotation class="px-10" id="pdfContent" />
  </div>
</template>

<script>
import PDFContent from "@/components/Pdf/PDFContent.vue";
import DocQuotation from "@/components/Pdf/DocQuotation.vue";
import axios from 'axios'

export default {
  data() {
    return {
      data: {}
    }
  },

  methods: {
    print(){
      window.print()
    },
    async getQuotation() {
      try {
        const response = await axios.get(``)
      }
      catch(err){
        console.log(err)
      }
    }
  },
  components: {
    PDFContent,
    DocQuotation,
  },
};
</script>

<style scoped></style>
