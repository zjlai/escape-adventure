<template>
  <div class="row justify-center">
    <q-input
      v-model="answer"
      filled
      placeholder="Type your answer here"
      class="q-mx-md"
    >
    </q-input>
    <q-btn
      label="submit"
      @click="validate"
      filled
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { scoringText } from 'src/apis/firebaseApis'
import { validationResponseInterface } from 'src/index'

export default defineComponent({
  name: 'textAnswer',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const answer = ref('')
    const router = useRouter()
    const validate = async () => {
      // validate using question ID
      console.log(props.id)
      const ans = {
        gameId: 'VDAxTTYU6IXuRwUiy9St',
        puzzleRef: props.id,
        hintsUsed: 0,
        answer: answer.value,
        timeTaken: 60,
        hintsPenalty: 100
      }
      const result = await scoringText(ans)
      const data = result.data as validationResponseInterface
      await router.push( { name: 'story', params: { storyRef: data.next}})
    }
    return {
      answer,
      validate
    }
  }
})
</script>

<style lang="scss" scoped>

</style>