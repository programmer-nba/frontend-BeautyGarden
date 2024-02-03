<template>
  <div>
    <a
      class="text-blueGray-500 py-1 px-3"
      href="#pablo"
      ref="btnDropdownRef"
      v-on:click="toggleDropdown($event)"
    >
      <i class="fas fa-ellipsis-v"></i>
    </a>
    <div
      ref="popoverDropdownRef"
      class="bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
      v-bind:class="{
        hidden: !dropdownPopoverShow,
        block: dropdownPopoverShow,
      }"
    >
      <button
      @click.prevent="openInvoice"
      class="text-sm py-2 bg-emerald-400 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-black"
    >
      ดูข้อมูล
    </button>
      <button
        @click.prevent="editInvoice"
        class="text-sm py-2 bg-orange-500 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white"
      >
        แก้ไข
      </button>
      <button
        @click.prevent="deleteInvoice"
        class="text-sm py-2 bg-red-400 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white"
      >
        ลบ
      </button>
    </div>
    
  </div>
</template>
<script>
/* eslint-disable */
import { createPopper } from "@popperjs/core";
import axios from 'axios'

export default {
  data() {
    return {
      dropdownPopoverShow: false,
    };
  },
  props: {
    invoice: Object
  },
  methods: {
    toggleDropdown: function (event) {
      event.preventDefault();
      if (this.dropdownPopoverShow) {
        this.dropdownPopoverShow = false;
      } else {
        this.dropdownPopoverShow = true;
        createPopper(this.$refs.btnDropdownRef, this.$refs.popoverDropdownRef, {
          placement: "bottom-start",
        });
      }
    },

    deleteInvoice: async function () {
      this.dropdownPopoverShow = false;
      const id = this.invoice._id
      await axios.delete(`${process.env.VUE_APP_API_BACKEND}/invoice/deleteInvoice/${id}`,
        {
          headers: {
            'auth-token': process.env.VUE_APP_AUTH_TOKEN_ADMIN
          }
        }).then((response)=>{
          console.log(response.data.message)
          this.$emit('deleted')
        }).catch((err)=>{
          console.log(err)
        })
    }
  },
};
</script>
