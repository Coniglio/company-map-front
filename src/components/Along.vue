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
      alongArray: null
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/alongs" )
      .then( response => {
        this.alongArray = response.data
      } )
    },
    methods: {
      filter: function () {
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
