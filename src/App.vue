<template>
  <div id="app">
    <div id="filters">
      <languages @input="onInputLanguages" />
      <alongs @input="onInputAlongs" />
    </div>

    <GmapMap
      :center="{
        lat:35.681236,
        lng:139.767125
      }"
      :zoom="13"
      :options="{
        streetViewControl: false
      }"
      map-type-id="terrain"
      style="height:100vh;width:100vw;position: relative;z-index: 0;"
    >
      <GmapInfoWindow
        :options="infoOptions"
        :position="infoWindowPos"
        :opened="infoWinOpen"
        @closeclick="infoWinOpen=false"
      >
        {{companyName}}
      </GmapInfoWindow>
      <div
        v-for="(m, index) in markers"
        :key="index"
      >
      <GmapMarker
        v-if="m.visible"
        :position="m.position"
        :clickable="true"
        @click="toggleInfoWindow(m)"
      />
      </div>
    </GmapMap>
  </div>
</template>

<script>
import Languages from './components/Language'
import Alongs from './components/Along'

import axios from 'axios'

export default {
  name: "app",
  components: {
    Languages,
    Alongs
  },
  data() {
    return {
      markers: [],
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoWindowPos: null,
      infoWinOpen: false,
      companyName: null,
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
            name: company.name,
            visible: true,
            languages: company.languages,
            alongs: company.alongs
          });
        }
    })
  },
  methods: {
    toggleInfoWindow (marker) {
      this.companyName = marker.name
      this.infoWindowPos = marker.position
      this.infoWinOpen = true
    },
    onInputLanguages(languageId, isChecked, checkedArray) {
      for ( let marker of this.markers) {
        marker.visible = false
        let isVisible = false
        lang: for ( let language of marker.languages) {
          for (let checked of checkedArray) {
            if (checked.id === language.id && checked.isChecked) {
              console.log(marker.name, language.id, checked.id, checked.isChecked)
              isVisible = true
              break lang
            }
          }
        }

        if (isVisible) {
          marker.visible = true;
        }
      }
    },
    onInputAlongs(alongId, isChecked) {
      console.log(alongId, isChecked);
    }
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
