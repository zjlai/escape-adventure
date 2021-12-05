<template>
  <q-page class="row items-center justify-evenly">
    <div class="col text-center">
      <game-title title="Escape from King Herod" />
      <story-carousel :id="gameId" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import GameTitle from 'src/components/game/title.vue'
import StoryCarousel from 'src/components/game/storyCarousel.vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'GamePage',
  components: {
    GameTitle,
    StoryCarousel
  },
  setup() {
    const route = useRoute()
    return {
      gameId: computed(() => route.params.puzzleId)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>