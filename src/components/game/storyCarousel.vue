<template>
  <div class="row justify-center align-center q-pa-lg">
    <q-carousel
      keep-alive
      animated
      swipeable
      vertical
      padding
      arrows
      navigation
      v-model="section"
      control-color="black"
      control-text-color="black"
      height="100%"
      style="max-width:960px;"
    >
      <story-slide
        v-for="slide in puzzle.content"
        :key="slide.name"
        :name="slide.name"
        :title="slide.title"
        :src="`gameImages/${slide.image}` ?? ''"
        :content="slide.content"
        class="column no-wrap flex-center"
      />
    </q-carousel>
    <text-answer v-if="puzzle.solutionType === 'text'" :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import StorySlide from 'src/components/game/storySlide.vue'
import textAnswer from 'src/components/game/solutions/textAns.vue'
import { dataService } from 'src/services/dataService'
import { puzzleInterface } from 'src/index'

export default defineComponent({
  name: 'StoryCarousel',
  components: {
    StorySlide,
    textAnswer
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const section = ref('')
    const puzzle = ref(<puzzleInterface>{})
    const { getPuzzle } = dataService()

    onMounted(() => {
      puzzle.value = getPuzzle(props.id) as puzzleInterface
      section.value = puzzle.value.content[0].name
      console.log(puzzle.value)
    })
    return {
      section,
      puzzle
    }
  }
})
</script>
