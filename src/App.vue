<template>
  <div id="app">
    <div id="filters">
      <languages />
      <alongs />
    </div>

    <GmapMap
      :center="{
        lat:35.681236,
        lng:139.767125
      }"
      :zoom="12"
      :options="{
        streetViewControl: false
      }"
      map-type-id="terrain"
      style="height:100vh;width:100vw;position: relative;z-index: 0;"
    >
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
      />
    </GmapMap>
  </div>
</template>

<script>
import Languages from './components/Language'
import Alongs from './components/Along'

import axios from 'axios'

export default {
  name: "HelloWorld",
  components: {
    Languages,
    Alongs
  },
  data() {
    return {
      markers: []
    };
  },
  created() {
    axios
      .get( "http://localhost:38081/api/v1/companymaps" )
      .then( response => {
        for ( let company of response.data ) {
          this.markers.push({
            position: {
              lat: company.latlng.lat,
              lng: company.latlng.lang
            },
            name: company.name
          });
        }
    })
  },
  methods: {
  }
};
</script>

<style scoped>
  #filters {
    position: absolute;
    left: 5px;
    top: 5px;
    z-index: 10;
  }
</style>