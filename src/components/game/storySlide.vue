<template>
  <q-carousel-slide
    :name="name"
    class="column no-wrap flex-center"
    >
    <p class="slide-title text-h4 text-bold">
      {{title}}
    </p>
    <q-img
      v-if="src"
      :src="src"
      fit="cover"
      position="center"
      width="70%"
    />
    <div class="q-mt-md text-center" v-html="content" />
    <slot name="action">
    </slot>
  </q-carousel-slide>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'StoryCarousel',
  props: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String
    },
    src: {
      type: String
    },
    content: {
      type: String
    }
  },
  setup(props) {
    const section = ref('')
    console.log(props)
    return {
      section
    }
  }
})
</script>
