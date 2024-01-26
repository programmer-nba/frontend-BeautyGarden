<template>
    <div class="flex flex-wrap">
      <div class="w-full sm:w-6/12 md:w-4/12 px-4">
        <div class="relative inline-flex align-middle w-full">
          <button class="text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 bg-emerald-500 active:bg-emerald-600 ease-linear transition-all duration-150" type="button" ref="btnDropdownRef" v-on:click="toggleDropdown()">
            เลือกจากคลัง
          </button>

          <div ref="popoverDropdownRef" class="bg-emerald-500 text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48" v-bind:class="{hidden: !dropdownPopoverShow,block: dropdownPopoverShow,}">
            <a class="text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-white">
                <div class="relative flex w-full flex-wrap items-stretch mb-3">
                    <input v-model="searchTarget" type="text" placeholder="" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10"/>
                    <span class="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-2 py-1">
                      <i class="fas fa-user"></i>
                    </span>
                </div>
            </a>
            <a @click="selectQt(data)" v-for="data in quotationsCode" :key="data" class="text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-white">
              {{ data }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  /* eslint-disable */
  import axios from 'axios'
  import { createPopper } from "@popperjs/core";
  
  export default {
    data() {
      return {
        dropdownPopoverShow: false,
        searchTarget: '',
        selectedQt: '',
        originalQuotationsCode: [],
        quotationsCode: []
      };
    },

    watch: {
        searchTarget: 'filterQt'
    },

    mounted() {
        this.fecthQuotationCodes()
    },

    methods: {
      toggleDropdown: function () {
        if (this.dropdownPopoverShow) {
          this.dropdownPopoverShow = false;
        } else {
          this.dropdownPopoverShow = true;
          createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
            placement: "bottom-start",
          });
        }
      },

      selectQt: function (data) {
        this.selectedQt = data
        this.$emit('refQuotation', this.selectedQt)
        this.toggleDropdown()
        this.searchTarget = ''
      },

      filterQt: function () {
        const lowerSearchTarget = this.searchTarget.toLowerCase()
        this.quotationsCode = this.originalQuotationsCode.filter(item => item.toLowerCase().includes(lowerSearchTarget));
      },

      fecthQuotationCodes: async function () {
        try {
            await axios.get(`${process.env.VUE_APP_API_BACKEND}/quotation/getQTAllfilter`,
                {
                    headers: {
                        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
                    }
                }).then((response)=>{
                    if(response.data.status){
                        console.log(response.data.message)
                        this.originalQuotationsCode = response.data.data.map((item)=>{
                            return item.quotation
                        })
                        this.filterQt()
                    }
                }).catch((err)=>{
                    console.log(err.response.data.message)
                })
            }
            catch(err){
                console.log(err)
            }
        }
    },
  };
  </script>