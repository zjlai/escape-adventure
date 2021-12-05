<template>
  <q-page class="row items-center justify-evenly">
    <div class="col text-center">
      <h1> {{$t("header.title")}}</h1>
      <q-btn
        label="start your adventure"
        color="purple"
        dark
      />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LandingPage',
  components: {},
  setup() {
    return {};
  }
});
</script>
