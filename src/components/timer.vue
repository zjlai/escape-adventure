<template>
  <p class="text-overline">Timer: {{ time }}</p>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { format } from 'quasar'
import { gameService } from 'src/services/gameService'

export default defineComponent({
  name: 'TimerComponent',
  props:{
    flat: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const timer = ref(0)
    const { pad } = format
    const { setTime } = gameService()
    let timerInterval: NodeJS.Timeout

    onMounted(() => {
      timerInterval = setInterval(() => {
        timer.value++
        setTime(timer.value)
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(timerInterval)
    })

    const formatTimer = (time: number) => {
      const mins = Math.floor(time/60)
      const secs = time % 60
      return `${pad(mins.toString(), 2)}:${pad(secs.toString(), 2)}`
    }
    return {
      time: computed(() => formatTimer(timer.value))
    }
  }
})
</script>
<style lang="scss" scoped>
.timer {
  width: 100%;
  max-width: 250px;
}
</style>