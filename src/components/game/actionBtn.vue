<template>
  <div>
    <q-btn
      v-if="contentType === 'narrative'"
      label="next"
      @click="go"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'ActionButton',
  props: {
    contentType: {
      type: String
    }
  },
  setup(props) {
    const router = useRouter()
    const go = async () => {
      // validate answer
      if (props.contentType === 'narrative') {
        await router.push( { name: 'game', params: { storyRef: 'UEqZ4e9YemsYbVygmcj7'}})
      }
    }
    return {
      go
    }
  }
})
</script>