<template>
  <v-list shaped>
    <v-list-item-group>
      <template v-for="(generousWelfare, i) in generousWelfareArray"> 
        <v-divider :key="`divider-${i}`"></v-divider>
        <v-list-item :key="`item-${i}`" :value="generousWelfare.id" @click="filter">
            <template v-slot:default="{ active, toggle }">
            <v-list-item-action @click="toggle">
                <v-checkbox
                :input-value="active"
                :true-value="generousWelfare.id" 
                v-model="checked[i]">
                </v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
                <v-list-item-title v-text="generousWelfare.name"></v-list-item-title>
            </v-list-item-content>
            </template>
        </v-list-item>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import axios from 'axios'

export default {
  name: 'generousWelfare',
  data: () => {
    return {
      generousWelfareArray: [],
      checked: [],
    }
  },
  mounted() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/generousWelfares"
    axios
      .get(url)
      .then( response => {
        this.generousWelfareArray = response.data

        // チェックボックスの初期状態を生成
        this.checked = Array.apply(null, Array(this.generousWelfareArray.length)).map(function () {return false})

        for (const [index, generousWelfare] of this.generousWelfareArray.entries()) {
          this.$store.state.checkedGenerousWelfare.push({id: generousWelfare.id, isChecked: this.checked[index]})
        }
      } )
  },
  methods: {
    /**
     * 福利厚生IDとチェック状態のマップを生成
     */
    filter: function (event) {
      // 福利厚生IDとチェック状態のマップを生成
      // TODO 仮実装
      this.checkedArray = [] // チェクボックスを作り替えるけど、対象だけ書き換えた方がよいかも
      // 手動でチェック状態の反映が必要。チェックボックスとデータが同期していない。作りの問題な気がする
      const generousWelfareId = Number(event.target.value)
      const isChecked = event.target.checked

      // 福利厚生
      for (const [index, generousWelfare] of this.generousWelfareArray.entries()) {
        
        // 福利厚生チェックボックス
        if (generousWelfare.id === generousWelfareId) {
          this.checkedArray.push({id: generousWelfare.id, isChecked: isChecked})
        } else {
          this.checkedArray.push({id: generousWelfare.id, isChecked: this.checked[index]})
        }
      }

      this.$store.state.checkedGenerousWelfare = this.checkedArray

      // 親コンポーネントに入力イベント通知
      this.$emit('input')
    },
  }
}
</script>

<style scoped>
</style>
