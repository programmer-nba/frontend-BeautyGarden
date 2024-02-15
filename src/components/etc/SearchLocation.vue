<template>
    <div>
      <input class="px-2 bg-sky-300" type="text" v-model.trim="searchInput" placeholder="Search for a location" @input="searchLocation" ref="searchInput">
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchInput: '',
      };
    },
    methods: {
      searchLocation() {
        const autocomplete = new google.maps.places.Autocomplete(this.$refs.searchInput);
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.geometry) {
            console.error("Place details not found for the input: ", place);
            return;
          }
          this.$emit('place-selected', place);
        });
      },
    },
  };
  </script>
  