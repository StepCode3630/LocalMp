<script setup>
import Header from './components/Header.vue'
import HelloWorld from './components/HelloWorld.vue'
import HomeLink from './components/HomeLink.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <Header />
  </header>

  <main>
    <HomeLink />
  </main>
</template>

<style scoped>
main {
  min-height: calc(84vh + 2px);
}
</style>
