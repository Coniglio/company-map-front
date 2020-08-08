<template>
  <v-card
    elevation="24"
    max-width="500"
    class="mx-auto"
  >
    <v-list-item-group multiple>
      <v-virtual-scroll
        :items="generousWelfareArray"
        height="300"
        item-height="70"
        width="300"
      >
        <template v-slot="{ item }"> 

          <v-list-item>
            <v-checkbox
              :input-value="item.id"
              :true-value="item.id"
              @click="filter(item.id)"
              :label="item.name"
              v-model="checkboxState[item.id]"
            >
            </v-checkbox>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list-item-group>
  </v-card>
</template>

<script>
import axios from 'axios'

export default {
  name: 'generousWelfare',
  data: () => ({
    generousWelfareArray: [],
    checkboxState: {}
  }),
  mounted() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/generousWelfares"
    axios
      .get(url)
      .then( response => {
        this.generousWelfareArray = response.data

        // チェックボックスの初期状態を生成
        for (const generousWelfare of this.generousWelfareArray.entries()) {
          this.checkboxState[generousWelfare[1].id] = false
          this.$store.state.checkedGenerousWelfares.push({id: generousWelfare[1].id, isChecked: false})
        }
      })
  },
  methods: {
    /**
     * 福利厚生IDとチェック状態のマップを生成
     */
    filter: function (id) {
      // 福利厚生IDとチェック状態のマップを生成
      // TODO 仮実装
      // 手動でチェック状態の反映が必要。チェックボックスとデータが同期していない。作りの問題な気がする
      const isChecked = this.checkboxState[id]

      // 福利厚生
      this.checkboxState[id] = isChecked
      for (let generousWelfares of this.$store.state.checkedGenerousWelfares) {
        if (generousWelfares.id == id) {
          generousWelfares.isChecked = this.checkboxState[id]
        }
      }

      // 親コンポーネントに入力イベント通知
      this.$emit('input')
    },
  }
}
</script>

<style scoped>
</style>
