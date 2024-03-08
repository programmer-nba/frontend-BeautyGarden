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

                <!--Footer-->
                <Footer />

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
import { ref } from 'vue';

const quotation = ref({
    subhead: {
        customer_name: "กรรมการผู้จัดการ",
        customer_company: "บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด (โรงพยาบาล บี.แคร์ เมดิคอลเซ็นเตอร์)",
        customer_address: "29 ม.6 ถ.พหลโยธิน แขวงสายไหม เขตสายไหม กรุงเทพ 10220",
        customer_tel: "",
        customer_fax: "",
        sample_lacation: "โรงพยาบาล บี.แคร์ เมดิคอลเซ็นเตอร์",
        document_no: "QT-2024020001",
        document_date: new Date(),
        offerer: "ศุภาพรรณ 080-897-8376",
        offerer_tax_id: "0105548132830"
    },
    bodies: [
        {
            title: "ตรวจคุณภาพน้ำทิ้ง ระหว่างเดือนมกราคม - ธันวาคม 2567",
            subtitles: [
                {
                    subtitle: "ตรวจคุณภาพน้ำทิ้ง จำนวน 7 จุด",
                    details: [
                        {
                            points: [
                                "ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)",
                                "บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด"
                            ],
                            params: [
                                {
                                    name: "pH",
                                    method: "Electrometric Method (4500-H+ B)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 100,
                                    total_price: 800,
                                },
                                {
                                    name: "BOD",
                                    method: "Membrane Electrode Method (4500-O G)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 400,
                                    total_price: 3200,
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
                detail: [ "1. ส่งผลวิเคราะห์ Analysis report / รายเดือน", "2.จัดทำเล่มรายงานผลการปฎิบัติตามมาตรการ EIA" ],
                sent: [
                    " ระหว่างมกราคม - มิถุนายน 2567",
                    "ระหว่างกรกฎาคม - ธันวาคม 2567",
                    "- ต้นฉบับสี 1 ชุด  และ สำเนาสี จำนวน 2 ชุด แผ่น นำส่งเล่มรายงานต่อ อธิบดีกรมสนับสนุนบริการสุขภาพ",
                    "- สำเนาสี 1 ฉบับ ,สำเนาขาวดำ 1 ฉบับ / CD 2 แผ่น นำส่ง บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด(รพ.บี.แคร์ เมดิคอลเซ็นเตอร์) และยื่นรายงานในระบบอิเล็กทรอนิกส์ของสำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม"
                ]
            }
        },
        {
            title: "ตรวจคุณภาพน้ำทิ้ง ระหว่างเดือนมกราคม - ธันวาคม 2567",
            subtitles: [
                {
                    subtitle: "ตรวจคุณภาพน้ำทิ้ง จำนวน 7 จุด",
                    details: [
                        {
                            points: [
                                "ระบบบำบัดน้ำเสียของอาคารรักษาพยาบาล ตรวจวัด 3 เดือน/ครั้ง (ก.พ. พ.ค. ส.ค. พ.ย. 2567)",
                                "บริเวณบ่อพักน้ำเสียหลังผ่านระบบบำบัดน้ำเสีย (WW1) จำนวน 2 จุด"
                            ],
                            params: [
                                {
                                    name: "pH",
                                    method: "Electrometric Method (4500-H+ B)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 100,
                                    total_price: 800,
                                },
                                {
                                    name: "BOD",
                                    method: "Membrane Electrode Method (4500-O G)",
                                    amount: 2,
                                    amount_unit: "จุด",
                                    freq: 4,
                                    freq_unit: "ครั้ง",
                                    unit_price: 400,
                                    total_price: 3200,
                                }
                            ]
                        }
                    ]
                }
            ],
            isReport: true,
            report: {
                freq: 2,
                freq_unit: "ครั้ง",
                unit_price: 10000,
                total_price: 20000,
                detail: [ "1. ส่งผลวิเคราะห์ Analysis report / รายเดือน", "2.จัดทำเล่มรายงานผลการปฎิบัติตามมาตรการ EIA" ],
                sent: [
                    " ระหว่างมกราคม - มิถุนายน 2567",
                    "ระหว่างกรกฎาคม - ธันวาคม 2567",
                    "- ต้นฉบับสี 1 ชุด  และ สำเนาสี จำนวน 2 ชุด แผ่น นำส่งเล่มรายงานต่อ อธิบดีกรมสนับสนุนบริการสุขภาพ",
                    "- สำเนาสี 1 ฉบับ ,สำเนาขาวดำ 1 ฉบับ / CD 2 แผ่น นำส่ง บริษัท แอร์พอร์ตเนิสซิ่งโฮม จำกัด(รพ.บี.แคร์ เมดิคอลเซ็นเตอร์) และยื่นรายงานในระบบอิเล็กทรอนิกส์ของสำนักงานนโยบายและแผนทรัพยากรธรรมชาติและสิ่งแวดล้อม"
                ]
            }
        }
    ],
})
</script>

<style scoped></style>
