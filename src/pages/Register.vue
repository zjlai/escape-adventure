<template>
  <q-page class="row items-center justify-evenly">
    <div class="col text-center">
    </div>
    <div class="col text-center">
        <q-input v-model="text" label="Team Name" />
        <q-input v-model="text" label="Email (one email would do)" />
        <br>
        <q-btn
            label="Submit"
            color="purple"
            dark
        />
    </div>
    <div class="col text-center">
    </div>
   </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
//import { useRoute } from 'vue-router'
// import { apiService } from 'src/apis/prismicApis'

export default defineComponent({
  name: 'RegisterPage',
  components: {
  },
  setup() {
    //const route = useRoute()
    return {
    }
  }
})
</script>

<style lang="scss" scoped>

</style>