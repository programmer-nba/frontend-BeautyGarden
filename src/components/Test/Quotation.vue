<template>
    <div>
        <div class="flex justify-center w-auto border items-start">
            <div class="border border-black w-full min-w-[215mm] h-auto bg-white scale-100 origin-top">
                <!--Header-->
                <Header />

                <!--SubHead-->
                <Subhead :data="quotation.subhead" />

                <!--Body Container-->
                <div class="col-span-12 grid grid-cols-12 border-b border-b-black">
                    <!--Menu-->
                    <BodyMenu />

                    <!--Body (v-for)-->
                    <div v-for="(body, index) in quotation.bodies" :key="index" class="col-span-12 grid grid-cols-12">
                        <!--Title-->
                        <BodyTitle :data="body.title" />
                        <!--Sub Title (v-for)-->
                        <BodySubTitle v-for="(sub, subIndex) in body.subtitles" :key="subIndex" :data="sub" :no="index+1" />
                        <!--Report-->
                        <ReportDetail v-if="body.isReport" :data="body.report" :no="`${index+1}.${body.subtitles.length}`" />
                    </div>
                </div>

                <!--Footer-->
                <Footer :data="quotation.footer" />

                <!--PaymentTerm-->
                <PaymentTerm :data="quotation.payment_term" />

                <!--Signature-->
                <Signature :data="quotation.signature" />
            </div>
        </div>
    </div>
</template>

<script setup>
import BodyTitle from "@/components/Test/Table/Body_Title.vue";
import BodySubTitle from "@/components/Test/Table/Body_subTitle.vue";
import ReportDetail from "@/components/Test/Table/ReportDetail.vue";
import Header from "@/components/Test/Table/Header.vue";
import Subhead from "@/components/Test/Table/Subhead.vue";
import BodyMenu from "@/components/Test/Table/BodyMenu.vue";
import Footer from "@/components/Test/Table/Footer.vue";
import PaymentTerm from "@/components/Test/Table/PaymentTerm.vue"
import Signature from "@/components/Test/Table/Signature.vue"
import { ref, onMounted } from 'vue';

onMounted(()=>{
    document.body.style.backgroundColor = 'white';
})

const { quotation } = defineProps(["quotation"])

</script>

<style scoped>

</style>
