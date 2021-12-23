<template>
  <div class="row justify-center">
    <q-input
      v-model="answer"
      filled
      placeholder="Type your answer here"
      class="q-mx-md"
      :disable="loading"
    >
    </q-input>
    <q-btn
      label="submit"
      @click="validate"
      filled
      color="primary"
      :loading="loading"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { scoringText } from 'src/apis/firebaseApis'
import { validationResponseInterface } from 'src/index'
import { gameService } from 'src/services/gameService'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'textAnswer',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup() {
    const answer = ref('')
    const loading = ref(false)
    const router = useRouter()
    const { getTime, getHintsUsed, getPenalty, getPuzzleId } = gameService()
    const $q = useQuasar()

    const validate = async () => {

      // validate using question ID
      loading.value = true
      const ans = {
        gameId: 'VDAxTTYU6IXuRwUiy9St',
        puzzleRef: getPuzzleId(),
        hintsUsed: getHintsUsed(),
        answer: answer.value.trim().toLowerCase(),
        timeTaken: getTime(),
        hintsPenalty: getPenalty()
      }
      console.log(ans)
      const result = await scoringText(ans)
      const data = result.data as validationResponseInterface
      if (data.next ?? false) {
        await router.push( { name: 'story', params: { storyRef: data.next}})
      } else {
        $q.notify('Wrong answer! Try again or check the hints!')
      }
      loading.value = false
    }
    return {
      answer,
      validate,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>

</style>