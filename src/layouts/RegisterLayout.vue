<template>
  <q-layout view="hHh lpR fFf" class="landing-bg">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style lang="scss" scoped>
.landing-bg {
  background-image: url('assets/egypt-bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>