<template>
  <div>
    <!-- <div class="flex flex-wrap">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-line-chart />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <card-bar-chart />
      </div>
    </div>
    <div class="flex flex-wrap mt-4">
      <div class="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <card-page-visits />
      </div>
      <div class="w-full xl:w-4/12 px-4">
        <card-social-traffic />
      </div>
    </div> -->
    <h1 style="margin-top:15rem; margin-bottom:10rem; margin-left:15rem; font-size:100px;" class="relative bottom-0 font-bold h-full">COMINGSOON......</h1>
  </div>
</template>
<script>
/* eslint-disable */
import CardLineChart from "@/components/Cards/CardLineChart.vue";
import CardBarChart from "@/components/Cards/CardBarChart.vue";
import CardPageVisits from "@/components/Cards/CardPageVisits.vue";
import CardSocialTraffic from "@/components/Cards/CardSocialTraffic.vue";
export default {
  name: "dashboard-page",
  components: {
    CardLineChart,
    CardBarChart,
    CardPageVisits,
    CardSocialTraffic,
  },
};
</script>
