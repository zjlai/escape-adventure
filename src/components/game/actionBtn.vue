<template>
  <div>
    <h6 class="text-overline" v-if="contentType !== 'narrative'" v-html="puzzle"></h6>
    <q-btn
      v-if="contentType === 'narrative'"
      label="next"
      @click="go"
    />
    <div v-else-if="contentType === 'singleMatch'">
      <text-ans :id="puzzleId" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { validateAnswer } from 'src/apis/firebaseApis'
import { validationResponseInterface } from 'src/index'
import textAns from 'src/components/game/solutions/textAns.vue'

export default defineComponent({
  name: 'ActionButton',
  props: {
    contentType: {
      type: String
    },
    puzzleId: {
      type: String
    },
    puzzle: {
      type: String
    }
  },
  components: {
    textAns
  },
  setup(props) {
    const router = useRouter()
    const answer = ref('')
    const go = async () => {
      // validate answer
      if (props.contentType === 'narrative') {
        const next = await validateAnswer(props.puzzleId)
        const data = next.data as validationResponseInterface
        console.log(data)
        await router.push( { name: 'story', params: { storyRef: data.next}})
      }
    }
    return {
      go,
      answer
    }
  }
})
</script>