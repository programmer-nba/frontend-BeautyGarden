<template>
    <div ref="map" style="height: 400px;">

    </div>
    <div>
        {{ selectedPlace?.utc_offset_minutes }}
        <div class="flex flex-col gap-y-2 justify-center items-center my-2">
            <Button class="px-2 py-1 border border-sky-400 rounded-md cursor-pointer">
                <a :href="selectedPlace?.url" target="_blank">
                    {{ selectedPlace?.name }}
                </a>
            </Button>
            <p>{{ selectedPlace?.formatted_address }}</p>
        </div>
        
        <div class="flex flex-wrap gap-2 gap-y-2 justify-start items-center">
            <div v-for="(photo, index) in selectedPlace?.photos" :key="index">
                <img class="object-cover w-[300px] h-[150px]" :src="photo.getUrl()" :alt="index" />
            </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GoogleMap',
    data() {
      return {
        map: null,
      };
    },
    props: {
        selectedPlace: {
            type: Object,
            default: null,
        },
    },
    mounted() {
      this.initMap();
    },
    methods: {
      async initMap() {
        console.log({...this.selectedPlace})
        const latLng = this.selectedPlace.geometry.location;
        this.map = new google.maps.Map(this.$refs.map, {
          zoom: 12,
          center: latLng.toJSON() // Bangkok coordinates
        });
        
        // Add a marker for a specific location
        this.addMarker(latLng.toJSON()); // Bangkok coordinates
      },
      addMarker(location) {
        // Add marker to the map
        new google.maps.Marker({
          position: location,
          map: this.map,
          title: 'Pinned Location'
        });
      }
    },
  };
  </script>
  