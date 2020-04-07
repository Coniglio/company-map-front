<template>
<div>
  <div class="language" v-for="(language, i) in languageArray" :key="language.id" @input="filter">
    <input type="checkbox" checked="checked" :value="language.id" v-model="selected[i]">
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
      languageArray: null,
      selected: null
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/languages" )
      .then( response => {
        this.languageArray = response.data

        // チェックボックスの初期状態を生成
        this.selected = Array.apply(null, Array(this.languageArray.length)).map(function () {return true})
      } )
  },
  methods: {
    filter: function (event) {
      this.$emit('change', Number(event.target.value), event.target.checked)
    },
  }
}
</script>

<style scoped>
.language {
    display: inline-block;
    background-color: #DF907C;
}
</style>
