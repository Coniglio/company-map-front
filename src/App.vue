<template>
  <v-app id="app">
    <v-app-bar fixed=true class="light-blue lighten-3">
      <img src="logo.png"/>

      <v-spacer></v-spacer>

      <v-menu bottom left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="white">{{ icons.mdiAccount }}</v-icon>
          </v-btn>
        </template> 

        <v-list>
          <v-list-item>
            <v-btn
                dark
                icon
              >
              <v-icon color="black">{{ icons.mdiEmail }}</v-icon>
            </v-btn>
            <v-list-item-title>メールアドレス変更</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-btn
                dark
                icon
              >
              <v-icon color="black">{{ icons.mdiLockReset }}</v-icon>
            </v-btn>
            <v-list-item-title>パスワード変更</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-btn
                dark
                icon
              >
              <v-icon color="black">{{ icons.mdiLogoutVariant }}</v-icon>
            </v-btn>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <template v-slot:extension>
        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn class="filter" v-on="on">言語</v-btn>
          </template>
          <languages :checkedLanguagesArray="checkedArray" @input="displayMarkers" />
        </v-menu>

        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn class="filter" v-on="on">沿線</v-btn>
          </template>
          <alongs :checkedAlongsArray="checkedArray" @input="displayMarkers" />
        </v-menu>

        <v-menu offset-y :close-on-content-click=false>
          <template v-slot:activator="{ on }">
            <v-btn class="filter" v-on="on">福利厚生</v-btn>
          </template>
          <generousWelfares :checkedGenerousWelfareArray="checkedArray" @input="displayMarkers" />
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
        style="height:94vh;width:100vw;position: relative;z-index: 0;"
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
          v-for="(m, index) in this.markers"
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
      <v-col cols="12" class="text-right">&copy; {{ new Date().getFullYear() }} étoile</v-col>
    </v-footer>
      
  </v-app>
</template>

<script>
import Languages from './components/Language'
import Alongs from './components/Along'
import GenerousWelfares from './components/GenerousWelfare'

import axios from 'axios'

import {
  mdiAccount,
  mdiLogoutVariant,
  mdiMapMarker,
  mdiLockReset,
  mdiEmail
} from '@mdi/js'

export default {
  name: "app",
  components: {
    Languages,
    Alongs,
    GenerousWelfares
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
      icons: {
        mdiAccount,
        mdiLogoutVariant,
        mdiMapMarker,
        mdiLockReset,
        mdiEmail
      }
    };
  },
  created() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/companymaps"
    axios
      .get(url)
      .then(response => {
        for (let company of response.data ) {
          this.markers.push({
            position: {
              lat: company.latlng.lat,
              lng: company.latlng.lang
            },
            id: company.id,
            name: company.name,
            visible: false,
            languages: company.languages,
            alongs: company.alongs,
            generousWelfares: company.generousWelfares
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
     * 選択状態に応じたマーカーをマップ上にAND条件で表示します
     * 
     */
    displayMarkers() {
      let languages = []
      for (const language of this.$store.state.checkedLanguages) {
        if (language.isChecked) {
          languages.push(language.id)
        }
      }

      let alongs = []
      for (const along of this.$store.state.checkedAlongs) {
        if (along.isChecked) {
          alongs.push(along.id)
        }
      }

      let generousWelfares = []
      for (const generousWelfare of this.$store.state.checkedGenerousWelfares) {
        if (generousWelfare.isChecked) {
          generousWelfares.push(generousWelfare.id)
        }
      }

      // チェック無しの場合、全てのマーカー非表示
      if (!languages.length && !alongs.length && !generousWelfares.length) {
        for (const marker of this.markers) {
            marker.visible = false
        }
        return
      }

      // JSON.stringify()

      // 表示する企業を取得
      const url = process.env.VUE_APP_API_SERVER + "/api/v1/displays"
      axios
        .get(url, {
          params: {
            languages: languages.length ? languages.join(',') : languages,
            alongs: alongs.length ? alongs.join(',') : alongs,
            generousWelfares: generousWelfares.length ? generousWelfares.join(',') : generousWelfares
          }
        })
        .then(response => {
          // 取得結果の企業を表示/非表示
          let displays = response.data
          for (const marker of this.markers) {
            marker.visible = false
            for (const display of displays) {
              if (marker.id === display.companyId) {
                marker.visible = true
                break
              }
            }
          }
      })
    }
  },
}
</script>

<style scoped>
  v-footer {
    height: 10px;
  }

  .filter {
    margin-right: 10px;
  }
</style>
