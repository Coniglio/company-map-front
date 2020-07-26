import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import vuetify from './plugins/vuetify';

Vue.use(VueGoogleMaps, {
  load: {
    key: this.process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: 'places',
    region: 'JP',
    language: 'ja'
  }
})

Vue.use(Vuex)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    checkedLanguages: [],
    checkedAlongs: [],
  }
});

new Vue({
  render: h => h(App),
  store,
  vuetify,
}).$mount('#app')
