<template>
  <q-card :flat="flat" :bordered="bordered" class="timer">
    <q-card-section>
      <p class="text-h4 q-pa-md q-ma-md">{{ time }}</p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, computed } from 'vue'
import { format } from 'quasar'

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

    let timerInterval

    onMounted(() => {
      timerInterval = setInterval(() => {
        timer.value++
      }, 1000)
    })

    onBeforeUnmount(() => {
      clearInterval(timerInterval)
    })

    const formatTimer = (time: number) => {
      const mins = Math.floor(time/60)
      const secs = time % 60
      return `${pad(mins, 2)}:${pad(secs, 2)}`
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