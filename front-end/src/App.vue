<template>
  <header>
    <Header />
  </header>

  <main>
    <RouterView />
  </main>
  <footer>
    <Footer />
  </footer>
</template>

<script setup>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
main {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
