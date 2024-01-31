<template>
    <div v-if="alertOpen" class="text-white w-6/12 px-6 py-2 border-0 rounded absolute mb-4 bg-teal-500" style="right:20px; top:20px;">
      <span class="text-xl inline-block mr-5 align-middle">
        <i class="fas fa-bell"></i>
      </span>
      <span class="inline-block align-middle mr-8">
        <b class="capitalize">{{ detail.title }}</b> {{ detail.text }}
      </span>
      <button class="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 outline-none focus:outline-none" v-on:click="closeAlert()">
        <span>×</span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: "teal-alert",
    data() {
      return {
        alertOpen: true,
      }
    },
    props:{
        detail: Object
    },
    methods: {
      closeAlert: function(){
        this.alertOpen = false;
      }
    },
    mounted() {
        this.alertOpen = true
        console.log('alert!')
    }
  }
  </script>