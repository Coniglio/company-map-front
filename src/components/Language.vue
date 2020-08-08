<template>
  <v-card
    elevation="24"
    max-width="500"
    class="mx-auto"
  >
    <v-list-item-group multiple>
      <v-virtual-scroll
        :items="languageArray"
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
  name: 'language',
  data: () => {
    return {
      languageArray: [],
      checkboxState: [],
    }
  },
  mounted() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/languages"
    axios
      .get(url)
      .then( response => {
        this.languageArray = response.data

        // チェックボックスの初期状態を生成
        for (const language of this.languageArray.entries()) {
          this.checkboxState[generousWelfare[1].id] = false
          this.$store.state.checkedGenerousWelfares.push({id: generousWelfare[1].id, isChecked: false})
        }
      })
  },
  methods: {
    /**
     * 言語IDとチェック状態のマップを生成
     */
    filter: function (id) {
      const isChecked = this.checkboxState[id]
      this.checkboxState[id] = isChecked

      // 言語
      for (let language of this.$store.state.checkedLanguages) {
        if (language.id == id) {
          language.isChecked = this.checkboxState[id]
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
