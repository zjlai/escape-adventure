<template>
  <div>
    <h5 class="text-bold q-mb-sm">
      Hints
    </h5>
    <p class="text-caption">If you are stuck, you can use the hints. Do note that you will incur a penalty for each hint you use!</p>
    <q-list
      v-if="hints"
      bordered
      separator
      dense
      class="text-left"
    >
      <hint-content
        v-for="n in hints.totalHints"
        :key="n"
        :index="n-1"
        :hintRef="hints.hintRef"
        :penalty="hints.penalties[n-1]"
      />
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import HintContent from './hintContent.vue'
import { getHints } from 'src/apis/firebaseApis'
import { gameService } from 'src/services/gameService'
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
    const { retrieveHints, saveHints } = gameService()
    onMounted(async () => {
      hints.value = retrieveHints()
      if (Object.keys(hints.value).length === 0) {
        const data = await getHints({ puzzleRef: route.params.storyRef })
        hints.value = data.data as HintsInterface
        console.log(hints.value)
        saveHints(hints.value)
      } else {
        console.log('hints available')
      }
    })
    return {
      hints
    }
  }
})
</script>