<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // Check if dark mode is already enabled
  isDark.value = document.documentElement.classList.contains('dark')
})

const goHome = () => {
  window.location.href = '/'
}

const goPageLogIn = () => {
  window.location.href = '/auth'
}

const toggleDarkMode = () => {
  const html = document.documentElement
  isDark.value = !isDark.value

  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('darkMode', 'true')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('darkMode', 'false')
  }
}
</script>

<template>
  <div class="header">
    <img
      @click="goHome"
      class="logo"
      v-if="isDark"
      src="../assets/music-library-svgrepo-com-light.svg"
      alt="logo"
    />
    <img
      @click="goHome"
      class="logo"
      v-else
      src="../assets/music-library-svgrepo-com.svg"
      alt="logo"
    />

    <div class="header-right">
      <button @click="goPageLogIn" class="btn-cta">Log in</button>
      <button
        @click="toggleDarkMode"
        class="dark-mode-toggle"
        :title="isDark ? 'Light Mode' : 'Dark Mode'"
      >
        <img v-if="isDark" src="../assets/sun.svg" alt="Light Mode" class="toggle-icon" />
        <img v-else src="../assets/moon.svg" alt="Dark Mode" class="toggle-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 20px;
  width: 100%;
  background-color: var(--color-background-header);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dark-mode-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
  hover {
    background: rgba(255, 255, 255, 0.1);
  }
}

.dark-mode-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.toggle-icon {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.logo {
  height: 100px;
  cursor: pointer;
}
</style>
