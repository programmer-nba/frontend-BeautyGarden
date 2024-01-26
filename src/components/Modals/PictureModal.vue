<template>
    <div>
        <!-- <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleModal()">
          Open regular modal
        </button> -->
        <div class="overflow-x-hidden top-95-px overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none justify-start items-center flex">
          <div class="relative w-full my-6 mx-auto">
            <!--content-->
            <div style="height:500px; width:500px;" class="border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">
              <!--header-->
              <div class="flex items-start justify-between border-b border-solid border-blueGray-200 rounded-t mx-3 px-2">
                <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="closeModal">
                  <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <!--body-->
              <div class="flex justify-center">
                <img :src="url" 
                alt="..." 
                class="shadow-lg rounded w-full h-full object-cover align-middle border-none" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  </template>
  
  <script setup>
  /* eslint-disable */
import { defineEmit } from 'vue';

 const props = defineProps(['url'])
 const emit = defineEmit(['closePicModal'])

 const closeModal = () => {
    emit('closePicModal')
 }

  </script>