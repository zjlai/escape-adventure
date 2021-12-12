<template>
  <q-page class="row items-center justify-evenly">
    <div class="col text-center">
      <game-title title="Escape from King Herod" />
      <story-carousel :id="gameId" />
      <hint-list />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import GameTitle from 'src/components/game/title.vue'
import StoryCarousel from 'src/components/game/storyCarousel.vue'
import HintList from 'src/components/hints/hintList.vue'
import { useRoute } from 'vue-router'
import { getPuzzle } from 'src/apis/firebaseApis'

export default defineComponent({
  name: 'GamePage',
  components: {
    GameTitle,
    StoryCarousel,
    HintList
  },
  setup() {
    const route = useRoute()
    // Reference Code
    onMounted(async () => {
      console.log('data')
      const data = await getPuzzle(route.params.puzzleRef)
      console.log(data.data)
    })
    return {
      gameId: computed(() => route.params.puzzleRef)
      // puzzle: computed(() => puzzle)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>