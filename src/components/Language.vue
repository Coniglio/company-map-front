<template>
<div>
  <div class="language" v-for="(language, i) in languageArray" :key="language.id" @input="filter">
    <input type="checkbox" checked="checked" :value="language.id" v-model="checked[i]">
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
      checked: null,
      checkedArray: []
    }
  },
  mounted() {
    axios
      .get( "http://localhost:38081/api/v1/languages" )
      .then( response => {
        this.languageArray = response.data

        // チェックボックスの初期状態を生成
        this.checked = Array.apply(null, Array(this.languageArray.length)).map(function () {return true})
      } )
  },
  methods: {
    /**
     * 言語IDとチェック状態のマップを生成
     */
    filter: function (event) {
      // 言語IDとチェック状態のマップを生成
      // TODO 仮実装
      this.checkedArray = [] // チェクボックスを作り替えるけど、対象だけ書き換えた方がよいかも
      // 手動でチェック状態の反映が必要。チェックボックスとデータが同期していない。作りの問題な気がする
      const languageId = Number(event.target.value)
      const isChecked = event.target.checked

      // 言語
      for (const [index, language] of this.languageArray.entries()) {
        
        // 言語チェックボックス
        if (language.id === languageId) {
          this.checkedArray.push({id: language.id, isChecked: isChecked})
        } else {
          this.checkedArray.push({id: language.id, isChecked: this.checked[index]})
        }
      }

      // 親コンポーネントに入力イベント通知
      this.$emit('input', languageId, isChecked, this.checkedArray)
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
