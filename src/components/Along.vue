<template>
<div>
  <div class="along" v-for="along of alongArray" :key="along.id" @input="filter">
    <input type="checkbox" checked="checked" :value="along.id">
    <label>{{ along.name }}</label>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'along',
  data: () => {
    return {
      alongArray: null,
      selected: null
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/alongs" )
      .then( response => {
        this.alongArray = response.data

        // チェックボックスの初期状態を生成
        this.selected = Array.apply(null, Array(this.alongArray.length)).map(function () {return true})
      } )
    },
    methods: {
      filter: function (event) {
        this.$emit('change', event.target.value)
      }
    }
}
</script>

<style scoped>
.along {
    display: inline-block;
    background-color: #ECD070;
}
</style>
