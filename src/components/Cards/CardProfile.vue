<template>
  <div
    class="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16"
  >
    <div class="px-6">
      <div class="flex flex-wrap justify-center">
        <div class="w-full px-4 flex justify-center">
          <div class="relative">
            <img
              alt="..."
              :src="logo"
              class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
            />
          </div>
        </div>
        <div class="w-full px-4 text-center mt-20">
          <div class="flex justify-center py-4 lg:pt-4 pt-8">
            <div class="mr-4 p-3 text-center">
              <span
                class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                22
              </span>
              <span class="text-sm text-blueGray-400">จำนวนลูกค้า</span>
            </div>
            <div class="mr-4 p-3 text-center">
              <span
                class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                10
              </span>
              <span class="text-sm text-blueGray-400">งานเดือนนี้</span>
            </div>
            <div class="lg:mr-4 p-3 text-center">
              <span
                class="text-xl font-bold block uppercase tracking-wide text-blueGray-600"
              >
                89
              </span>
              <span class="text-sm text-blueGray-400">ใบเสร็จ</span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-12">
        <h3
          class="text-xl font-semibold leading-normal text-blueGray-700 mb-2"
        >
          สวนสวยการ์เด้นคอร์เปอเรชั่น
        </h3>
        <div
          class="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase pb-16 px-4 pt-2"
        >
          <i class="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>
          146 ถนนจอมทองบูรณะ แขวงบางมด เขตบางมด กรุงเทพมหานคร 10150
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      
    };
  },
};
</script>
