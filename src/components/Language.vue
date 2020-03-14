<template>
<div>
  <div class="language" v-for="language of languageArray" :key="language.id" @input="filter">
    <input type="checkbox" checked="checked" :value="language.id">
    <label>{{ language.name }}</label>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'language',
  data: () => {
    return {
      languageArray: null
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/languages" )
      .then( response => {
        this.languageArray = response.data
      } )
  },
  methods: {
    filter: function () {
    }
  }
}
</script>

<style scoped>
.language {
    display: inline-block;
    background-color: #DF907C;
}
</style>
