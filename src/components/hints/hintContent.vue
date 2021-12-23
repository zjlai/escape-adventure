<template>
  <q-item>
    <q-item-section avatar>
      <q-icon name="lightbulb" color="primary" />
    </q-item-section>
    <q-item-section v-if="!hidden">
      <q-item-label class="text-overline">
        Hint #{{ index + 1 }} (-{{penalty}} points)
      </q-item-label>
      <p class="q-my-md">
        {{ hint }}
      </p>
    </q-item-section>
    <q-item-section v-else class="cursor-pointer text-overline" @click="revealHint">
      Click to Reveal Hint. (-{{penalty}} points)
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue'
import { getHint } from 'src/apis/firebaseApis'
import { HintInterface } from 'src/index'
import { gameService } from 'src/services/gameService'

export default defineComponent({
  name: 'HintContent',
  props:{
    index: {
      type: Number,
      default: 0
    },
    hintRef: {
      type: String,
      required: true
    },
    penalty: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const hint = ref('')
    const penalty = ref(props.penalty)
    const hidden = ref(true)
    const { retrieveHint, saveHint, incrementPenalty, incrementHints } = gameService()
    const revealHint = async () => {
      const q = await getHint({ hintRef: props.hintRef, hintLevel: props.index })
      const hintData = q.data as HintInterface
      hint.value = hintData.hint
      penalty.value = hintData.penalty
      hidden.value = false
      saveHint(`${props.hintRef}-${props.index}`, hintData)
      incrementHints()
      incrementPenalty(hintData.penalty)
    }

    onMounted(() => {
      const h = retrieveHint(`${props.hintRef}-${props.index}`)
      if (h) {
        hint.value = h.hint
        penalty.value = h.penalty
        hidden.value = false
      }
    })

    return {
      hidden,
      hint,
      deduction: computed(() => penalty.value),
      revealHint
    }
  }
})
</script>
<style lang="scss" scoped>
</style>