<template>
  <v-app id="app">
    <v-app-bar fixed=true class="light-blue lighten-3">
      <v-img width="20px" height="10px" src="https://cdn.worldvectorlogo.com/logos/vuetify.svg"></v-img>
      <v-col class="text-left">test</v-col>

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template> 

        <v-list>
          <v-list-item>
            <v-list-item-title>ユーザーメニュー的な感じ</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">言語</v-btn>
          </template>
          <languages :checkedLanguagesArray="checkedArray" @input="displayMarkers" />
        </v-menu>

        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">沿線</v-btn>
          </template>
          <alongs :checkedAlongsArray="checkedArray" @input="displayMarkers" />
        </v-menu>

        <v-menu offset-y :close-on-content-click=false v-scroll:#scroll-target="onScroll">
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">福利厚生</v-btn>
          </template>
          <generousWelfare :checkedGenerousWelfareArray="checkedArray" @input="displayMarkers" />
        </v-menu>

        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on">年収</v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>test</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
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
        style="height:96vh;width:100vw;position: relative;z-index: 0;"
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
    </v-main>

    <v-footer fabsolute :padless=true>
      <v-col cols="12" class="text-right">&copy; {{ new Date().getFullYear() }}</v-col>
    </v-footer>
      
  </v-app>
</template>

<script>
import Languages from './components/Language'
import Alongs from './components/Along'
import GenerousWelfare from './components/GenerousWelfare'

import axios from 'axios'

export default {
  name: "app",
  components: {
    Languages,
    Alongs,
    GenerousWelfare
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
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/companymaps"
    axios
      .get(url)
      .then( response => {
        for ( let company of response.data ) {
          this.markers.push({
            position: {
              lat: company.latlng.lat,
              lng: company.latlng.lang
            },
            name: company.name,
            visible: false,
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

        // 企業の福利厚生
      }
    },
  }
};
</script>

<style scoped>
  v-footer {
    height: 10px;
  }
</style>
