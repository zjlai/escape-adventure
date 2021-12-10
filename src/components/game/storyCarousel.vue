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
      v-if="puzzle"
    >
      <story-slide
        v-for="slide in puzzle.data.content"
        :key="slide.name"
        :name="slide.name"
        :title="slide['content-title'][0].text"
        :src="slide.image.url"
        :content="slide['content-content'][0].text"
        class="column no-wrap flex-center fit"
      />
    </q-carousel>
    <text-answer v-if="puzzle && puzzle.data.solutiontype === 'text'" :id="id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref , onMounted } from 'vue'
import StorySlide from 'src/components/game/storySlide.vue'
import textAnswer from 'src/components/game/solutions/textAns.vue'
// import { dataService } from 'src/services/dataService'
// import { puzzleInterface } from 'src/index'
// import { apiService } from 'src/apis/prismicApis'
import { usePrismic } from '@prismicio/vue';
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
    const puzzle = ref(<puzzleInterface | null>null)
    // const { getPuzzle } = dataService()
    const { client } = usePrismic();
    console.log(props.id)
    // const puzzlePrismic = getPuzzle(props.id)

    onMounted(async() => {
      puzzle.value = await client.getByID(props.id) as unknown as puzzleInterface
      section.value = puzzle.value.data.content[0].name
    })
    // onMounted(() => {
    //   puzzle.value = getPuzzle(props.id) as puzzleInterface
    //   section.value = puzzle.value.content[0].name
    //   console.log(puzzle.value)
    // })
    return {
      section,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      puzzle
    }
  }
})
</script>
