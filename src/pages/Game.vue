<template>
  <q-page class="col" :key="gameId">
    <div class="row">
      <q-space />
      <div class="text-overline q-ma-md">
        Game ID: id
      </div>
      <timer class="q-ma-md" />
    </div>
    <div class="row items-center justify-evenly fit">
      <div class="col text-center fit">
        <story-carousel :id="gameId" :key="gameId" class="fit" />
        <!-- <hint-list /> -->
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import StoryCarousel from 'src/components/game/storyCarousel.vue'
import Timer from 'src/components/timer.vue'
import { useRoute } from 'vue-router'
import { gameService } from 'src/services/gameService'

/* eslint-disable @typescript-eslint/no-unsafe-call */

export default defineComponent({
  name: 'GamePage',
  components: {
    StoryCarousel,
    Timer
    // HintList
  },
  setup() {
    const route = useRoute()
    const { reset, setPuzzleId } = gameService()
    onMounted(() => {
      reset()
      setPuzzleId(route.params.storyRef as string)
    })
    return {
      gameId: computed(() => route.params.storyRef)
      // puzzle: computed(() => puzzle)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>