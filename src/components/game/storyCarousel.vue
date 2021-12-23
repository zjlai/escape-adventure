<template>
  <div class="row justify-center align-center">
    <div>
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
        v-if="puzzle"
      >
        <story-slide
          v-for="slide in puzzle.storyblocks"
          :key="slide.title"
          :name="slide.title"
          :title="slide.title"
          :src="slide.image"
          :content="slide.text"
          class="column no-wrap flex-center fit"
        >
          <template v-slot:action>
            <action-button
              v-if="section === lastStory"
              :contentType="puzzle.contentType"
              :puzzleId="id"
              :puzzle="puzzle.puzzle?.puzzle"
              class="q-my-md"
            />
            <hint-list
              v-if="section === lastStory && puzzle.contentType !== 'narrative'"
            />
          </template>
        </story-slide>
      </q-carousel>
      <!-- <text-answer v-if="puzzle && puzzle.data.solutiontype === 'text'" :id="id" /> -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref , onMounted } from 'vue'
import StorySlide from 'src/components/game/storySlide.vue'
import ActionButton from 'src/components/game/actionBtn.vue'
import HintList from 'src/components/hints/hintList.vue'
import { getContent } from 'src/apis/firebaseApis'
import { puzzleInterface } from 'src/index'

export default defineComponent({
  name: 'StoryCarousel',
  components: {
    StorySlide,
    ActionButton,
    HintList
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const section = ref('')
    const lastStory = ref('')
    const puzzle = ref(<puzzleInterface>{})
    console.log(props.id)

    onMounted(async () => {
      const data = await getContent(props.id)
      console.log(data)
      puzzle.value = data.data as puzzleInterface
      section.value = puzzle.value.storyblocks[0].title
      lastStory.value = puzzle.value.storyblocks[puzzle.value.storyblocks.length - 1].title
    })
    // onMounted(() => {
    //   puzzle.value = getPuzzle(props.id) as puzzleInterface
    //   section.value = puzzle.value.content[0].name
    //   console.log(puzzle.value)
    // })
    return {
      section,
      puzzle,
      lastStory
    }
  }
})
</script>
