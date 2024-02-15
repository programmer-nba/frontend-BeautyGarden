<template>
  <div class="flex flex-col justify-center items-center">
    <SearchLocation @place-selected="handlePlaceSelected" />
    <Map v-if="selectedPlace" :selectedPlace="selectedPlace" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Map from '@/components/etc/Map.vue'
import SearchLocation from '@/components/etc/SearchLocation.vue';

const selectedPlace = ref(null);

function handlePlaceSelected(place) {
  selectedPlace.value = place;
}
</script>
