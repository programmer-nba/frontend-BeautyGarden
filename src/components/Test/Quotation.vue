<template>
    <div>
        <div class="flex justify-center w-full border items-start">
            <div class="border border-black w-[210mm] min-h-[297mm] bg-white">
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
import { ref } from 'vue';

const quotation = ref({
    subhead: {},
    bodies: [
        {
            title: "title",
            subtitles: [
                {
                    subtitle: "subTitle-1",
                    details: [
                        {
                            points: ["-"],
                            params: [
                                {
                                    name: "-",
                                    method: "-",
                                    amount: 0,
                                    amount_unit: "จุด",
                                    freq: 0,
                                    freq_unit: "ครั้ง",
                                    unit_price: 0,
                                    total_price: 0,
                                }
                            ]
                        }
                    ]
                }
            ],
            isReport: false,
            report: {
                freq: 0,
                freq_unit: 0,
                unit_price: 0,
                total_price: 0,
                detail: [""],
                sent: [""]
            }
        }
    ],
})
</script>

<style scoped></style>
