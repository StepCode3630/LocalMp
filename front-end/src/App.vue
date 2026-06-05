<script setup>
import Footer from './components/Footer.vue'
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
  <footer>
    <Footer />
  </footer>
</template>

<style scoped>
main {
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
