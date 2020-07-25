<template>
  <v-app id="app">
    <div id="filters">
      <alongs :checkedAlongsArray="checkedArray" @input="displayMarkers" />
      
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">言語</v-btn>
        </template>
        <languages :checkedLanguagesArray="checkedArray" @input="displayMarkers" />
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">沿線</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">福利厚生</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on">年収</v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
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
  </v-app>
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
    toggleInfoWindow(marker) {
      this.companyName = marker.name
      this.infoWindowPos = marker.position
      this.infoWinOpen = true
    },
    /**
     * 選択状態に応じたマーカーをマップ上に表示します
     * 
     */
    displayMarkers() {
      for ( let marker of this.markers) {
        marker.visible = false

        // 企業が採用している言語
        lang: for ( let language of marker.languages) {

          // 言語チェックボックス
          for (let checked of this.$store.state.checkedLanguages) {
            // チェックした言語のIDと企業言語IDが一致 & チェックオン
            if (checked.id === language.id && checked.isChecked) {
              marker.visible = true
              break lang
            }
          }
        }

        // 企業が最寄りの沿線
        along: for ( let along of marker.alongs) {

          // 言語チェックボックス
          for (let checked of this.$store.state.checkedAlongs) {
            // チェックした言語のIDと企業言語IDが一致 & チェックオン
            if (checked.id === along.id && checked.isChecked) {
              marker.visible = true
              break along
            }
          }
        }
      }
    },
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
