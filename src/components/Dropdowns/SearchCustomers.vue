<template>
    <div class="flex flex-wrap">
      <div class="w-full py-2">
        <div class="relative inline-flex align-middle w-full">
          <div class="flex">
            <button class="text-white font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 bg-emerald-500 active:bg-emerald-600 ease-linear transition-all duration-150" type="button" ref="btnDropdownRef" v-on:click="toggleDropdown()">
              เลือกจาก {{ curTypeText==='name' ? 'ชื่อลูกค้า' : curTypeText==='tax' ? 'TAX ID' : 'รหัสลูกค้า' }}
            </button>
            <button class="text-white font-bold uppercase text-sm px-2 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 bg-emerald-500 active:bg-emerald-600 ease-linear transition-all duration-150" type="button" @click="chooseTypeSearch">►</button>
          </div>
          <div ref="popoverDropdownRef" style="max-height: 300px; height: auto;" class="bg-emerald-500 overflow-y-auto text-base z-50 float-left py-2 list-none text-left rounded shadow-lg mt-1 min-w-48" v-bind:class="{hidden: !dropdownPopoverShow,block: dropdownPopoverShow,}">
            <a class="text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-white">
                <div class="relative flex w-full flex-wrap items-stretch mb-3">
                    <input v-model="searchTarget" type="text" placeholder="" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 relative bg-white rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full pr-10"/>
                    <span class="z-10 h-full leading-snug font-normal text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 right-0 pr-2 py-1">
                      <i class="fas fa-user"></i>
                    </span>
                </div>
            </a>
            <a @click="selectCustomer(data)" v-for="(data, index) in searchList" 
              :key="index" 
              class="text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent text-white cursor-pointer"
              >
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
        selectedCustomer: '',
        originalCustomers: [],
        customersName: [],
        customersTax: [],
        customersCode: [],
        searchList: [],
        curTypeCode: 1,
      };
    },

    watch: {
        searchTarget: 'filterCustomers'
    },

    mounted() {
        this.fecthCustomers()
    },

    computed: {
      curTypeText() {
        return (this.curTypeCode===1) ? 'name' : (this.curTypeCode===2) ? 'tax' : 'code'
      },
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

      chooseTypeSearch: function () {
        if(this.curTypeCode === 1) {
          this.curTypeCode ++
          this.filterCustomers()
        } else if (this.curTypeCode === 2) {
          this.curTypeCode ++
          this.filterCustomers()
        } else {
          this.curTypeCode = 1
          this.filterCustomers()
        }
      },

      selectCustomer: function (data) {
        console.log(this.originalCustomers)
        const customerData = 
          (this.curTypeText==='name') ? this.originalCustomers.find(item => `${item.customer_name} ${item.customer_lastname}` === data)
        : (this.curTypeText==='tax') ? this.originalCustomers.find(item => item.customer_taxnumber === data)
        : this.originalCustomers.find(item => item.customer_number === data)
        console.log(customerData)
        this.selectedCustomer = data
        this.$emit('refCustomer', customerData)
        this.toggleDropdown()
        this.searchTarget = ''
      },

      filterCustomers: function () {
        const type = this.curTypeText
        console.log(type)
        const lowerSearchTarget = this.searchTarget.toLowerCase()
        this.searchList = 
        (type === 'name') ? this.customersName.filter(item => item.toLowerCase().includes(lowerSearchTarget))
        : (type === 'tax') ? this.customersTax.filter(item => item.toLowerCase().includes(lowerSearchTarget))
        : (type === 'code') ? this.customersCode.filter(item => item.toLowerCase().includes(lowerSearchTarget))
        : []
      },

      fecthCustomers: async function () {
        try {
            await axios.get(`${process.env.VUE_APP_API_BACKEND}/customer/getCustomerAll`,
                {
                    headers: {
                        'auth-token': `${process.env.VUE_APP_AUTH_TOKEN_ADMIN}`
                    }
                }).then((response)=>{
                    if(response.data.status){
                        console.log(response.data.message)
                        this.originalCustomers = response.data.data
                        this.customersName = response.data.data.map((item)=>{
                            return `${item.customer_name} ${item.customer_lastname}`
                        })
                        this.customersTax = response.data.data.map((item)=>{
                            return item.customer_taxnumber
                        })
                        this.customersCode = response.data.data.map((item)=>{
                            return item.customer_number
                        })
                        this.filterCustomers('name')
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