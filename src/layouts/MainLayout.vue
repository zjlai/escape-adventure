<template>
  <q-layout view="hHh lpR fFf" class="landing-bg">

    <q-header class="bg-transparent text-black">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg">
          </q-avatar>
          {{$t("header.title")}}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
      <p id="attribution" class="text-right">
        Photo by <a href="https://unsplash.com/@mariamsoliman?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mariam Soliman</a> on <a href="https://unsplash.com/s/photos/escape-to-egypt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
      </p>
    </q-page-container>
    <q-footer class="bg-transparent text-black text-center">
      <q-toolbar>
        <q-toolbar-title>
          <div>{{$t("header.title")}}</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<style lang="scss" scoped>
.landing-bg {
  background-image: url('assets/egypt-bg.jpg');
  background-size: cover;
  background-position: center;
}
</style>