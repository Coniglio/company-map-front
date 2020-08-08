<template>
  <v-card
    elevation="24"
    max-width="500"
    class="mx-auto"
  >
    <v-list-item-group multiple>
      <v-virtual-scroll
        :items="alongArray"
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
  name: 'along',
  data: () => {
    return {
      alongArray: [],
      checkboxState: {},
    }
  },
  mounted() {
    const url = process.env.VUE_APP_API_SERVER + "/api/v1/alongs"
    axios
      .get(url)
      .then( response => {
        this.alongArray = response.data

        // チェックボックスの初期状態を生成
        for (const along of this.alongArray.entries()) {
          this.checkboxState[along[1].id] = false
          this.$store.state.checkedAlongs.push({id: along[1].id, isChecked: false})
        }
      })
    },
    methods: {
      /**
       * 沿線IDとチェック状態のマップを生成
       */
      filter: function (id) {
        const isChecked = this.checkboxState[id]

        // 沿線
        this.checkboxState[id] = isChecked
        for (let along of this.$store.state.checkedAlongs) {
          if (along.id == id) {
            along.isChecked = this.checkboxState[id]
          }
        }

        // 親コンポーネントに入力イベント通知
        this.$emit('input') 
      }
    }
}
</script>

<style scoped>
</style>
