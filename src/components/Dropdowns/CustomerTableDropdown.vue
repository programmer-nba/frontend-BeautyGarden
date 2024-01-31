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
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        ดูข้อมูล
      </a>
      <a
        href="javascript:void(0);"
        class="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
      >
        แก้ไข
      </a>
      <button
        @click.prevent="deleteCustomer"
        class="text-sm py-2 bg-red-400 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-white hover:bg-red-600"
      >
        ลบ
      </button>
    </div>
  </div>
</template>
<script>
import { createPopper } from "@popperjs/core";
import axios from 'axios'

export default {
  data() {
    return {
      dropdownPopoverShow: false,
    };
  },
  props: {
    customer: Object
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

    deleteCustomer: async function () {
      const id = this.customer._id
      await axios.delete(`${process.env.VUE_APP_API_BACKEND}/customer/deleteCustomer/${id}`,
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
