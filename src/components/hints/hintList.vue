<template>
  <q-list
    separator
    bordered
  >
    <hint-content
      v-for="(n, index) in hints.totalHints"
      :key="index"
      :index="index"
      :hintRef="hints.hintRef"
      :penalty="hints.penalties[index]"
    />
  </q-list>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HintContent from './hintContent.vue'
import { getHints } from 'src/apis/firebaseApis'
import { HintsInterface } from 'src/index.d'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'HintList',
  components: {
    HintContent
  },
  setup () {
    const hints = ref(<HintsInterface>{})
    const route = useRoute()

    onMounted(async () => {
      const data = await getHints({ puzzleRef: route.params.puzzleRef })
      hints.value = data.data as HintsInterface
      console.log(hints.value)
    })
    return {
      hints
    }
  }
})
</script>