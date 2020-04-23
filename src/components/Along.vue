<template>
<div>
  <div class="along" v-for="(along, i) in alongArray" :key="along.id" @input="filter">
    <input type="checkbox" checked="checked" :value="along.id" v-model="checked[i]">
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
      checked: null,
      checkedArray: []
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/alongs" )
      .then( response => {
        this.alongArray = response.data

        // チェックボックスの初期状態を生成
        this.checked = Array.apply(null, Array(this.alongArray.length)).map(function () {return false})
      } )
    },
    methods: {
      filter: function (event) {
        // TODO 仮実装
        this.checkedArray = []
        for (const [index, along] of this.alongArray.entries()) {
          this.checkedArray.push({id: along.id, isChecked: this.checked[index]})
        }
        this.$emit('input', Number(event.target.value), event.target.checked, this.checkedArray)
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
