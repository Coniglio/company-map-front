<template>
  <v-list>
    <v-list-item v-for="(along, i) in alongArray" :key="along.id" @click="filter">
      <input type="checkbox" checked="checked" :value="along.id" v-model="checked[i]">
      <v-list-item-title>{{ along.name }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
import axios from 'axios'

export default {
  name: 'along',
  data: () => {
    return {
      alongArray: null,
      checked: null,
    }
  },
  mounted() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/alongs"
    axios
      .get(url)
      .then( response => {
        this.alongArray = response.data

        // チェックボックスの初期状態を生成
        this.checked = Array.apply(null, Array(this.alongArray.length)).map(function () {return false})

        for (const [index, along] of this.alongArray.entries()) {
          this.$store.state.checkedAlongs.push({id: along.id, isChecked: this.checked[index]})
        }
      } )
    },
    methods: {
      /**
       * 言語IDとチェック状態のマップを生成
       */
      filter: function (event) {
        this.checkedArray = [] // チェクボックスを作り替えるけど、対象だけ書き換えた方がよいかも
        // 手動でチェック状態の反映が必要。チェックボックスとデータが同期していない。作りの問題な気がする
        const alongId = Number(event.target.value)
        const isChecked = event.target.checked

        // 言語
        for (const [index, along] of this.alongArray.entries()) {
          
          // 言語チェックボックス
          if (along.id === alongId) {
            this.checkedArray.push({id: along.id, isChecked: isChecked})
          } else {
            this.checkedArray.push({id: along.id, isChecked: this.checked[index]})
          }
        }

        this.$store.state.checkedAlongs = this.checkedArray

        // 親コンポーネントに入力イベント通知
        this.$emit('input')
      }
    }
}
</script>

<style scoped>
</style>
