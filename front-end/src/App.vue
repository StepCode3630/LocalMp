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
  background: #ffffff;
  background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(216, 216, 216, 1) 100%);
  min-height: calc(84vh + 2px);
}
</style>
