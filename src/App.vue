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
    /**
     * 言語の選択状態に応じたマーカーをマップ上に表示します
     * 
     * @param languageId チェックした言語のID
     * @param isChecked チェックした言語チェックボックスのチェック状態
     * @param checkedArray 全言語チェックボックスのチェック状態
     */
    onInputLanguages(languageId, isChecked, checkedArray) {
      /**
       * 1.企業マーカーでループ
       * 2.言語でループ
       * 3.チェック状態を反映
       *  単一の言語のチェック状態だけを反映すると、PHPはオフでもGoはオンなので表示が必要なケースがある
       */
      // 企業
      for ( let marker of this.markers) {
        marker.visible = false

        // 企業が採用している言語
        lang: for ( let language of marker.languages) {
          // 言語チェックボックス
          for (let checked of checkedArray) {
            // チェックした言語のIDと企業言語IDが一致 & チェックオン
            if (checked.id === language.id && checked.isChecked) {
              marker.visible = true
              break lang
            }
          }
        }
      }
    },
    /**
     * 
     * @param alongId チェックした沿線のID
     * @param isChecked チェックした沿線チェックボックスのチェック状態
     * @param checkedArray 全沿線チェックボックスのチェック状態
     */
    onInputAlongs(alongId, isChecked, checkedArray) {
      for ( let marker of this.markers) {
        marker.visible = false

        // 企業最寄りの沿線
        lang: for ( let along of marker.alongs) {
          // 沿線チェックボックス
          for (let checked of checkedArray) {
            // チェックした沿線のIDと企業の沿線IDが一致 & チェックオン
            if (checked.id === along.id && checked.isChecked) {
              marker.visible = true
              break lang
            }
          }
        }
      }
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
