<template>
  <div class="app">
    <header>
      <Header />
    </header>

    <main>
      <RouterView />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
