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
    const validate = async () => {
      // validate using question ID
      console.log(props.id)
      const router = useRouter()

      if (true) await router.push({ name: 'game', params: { id: 'nextpuzzleID' }})
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