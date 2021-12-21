<template>
  <q-page class="row items-center justify-evenly">
    <div class="col text-center">
      <story-carousel :id="gameId" />
      <!-- <hint-list /> -->
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import StoryCarousel from 'src/components/game/storyCarousel.vue'
// import HintList from 'src/components/hints/hintList.vue'
import { useRoute } from 'vue-router'

/* eslint-disable @typescript-eslint/no-unsafe-call */

export default defineComponent({
  name: 'GamePage',
  components: {
    StoryCarousel,
    // HintList
  },
  setup() {
    const route = useRoute()
    // Reference Code
    // onMounted(async () => {
    //   console.log('data')
    //   const data = await getContent(route.params.storyRef)
    //   console.log(data.data)
    // })
    return {
      gameId: computed(() => route.params.storyRef)
      // puzzle: computed(() => puzzle)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>