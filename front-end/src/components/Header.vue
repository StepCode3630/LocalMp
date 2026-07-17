<script setup>
import { API_BASE } from '@/api/apiPlaylist'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'

const isDark = ref(false)

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: true,
  }),
  actions: {
    async fetchMe() {
      this.loading = true
      try {
        const headers = {
          Accept: 'application/json',
        }
        const token = localStorage.getItem('access_token')

        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const res = await fetch(`${API_BASE}/account/profile`, {
          method: 'GET',
          credentials: 'include',
          headers,
        })

        if (!res.ok) {
          if (res.status === 401) {
            this.user = null
            return
          }
          throw new Error(`Failed to fetch profile: ${res.status}`)
        }

        const data = await res.json().catch(() => null)
        this.user = data?.user ?? data ?? null
      } catch (e) {
        this.user = null
      } finally {
        this.loading = false
      }
    },
  },
})

const auth = useAuthStore()

const refreshAuth = () => {
  auth.fetchMe()
}

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
  refreshAuth()
  window.addEventListener('auth-changed', refreshAuth)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth-changed', refreshAuth)
})

const goHome = () => {
  window.location.href = '/'
}

const goPageLogIn = () => {
  window.location.href = '/auth'
}

const goPageProfile = () => {
  window.location.href = '/profile'
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
    <img @click="goHome" class="logo" v-if="isDark" src="../assets/music-library-svgrepo-com-light.svg" alt="logo" />
    <img @click="goHome" class="logo" v-else src="../assets/music-library-svgrepo-com.svg" alt="logo" />

    <div class="header-right">
      <button v-if="auth.loading" disabled class="btn-cta">Chargement...</button>
      <button v-else-if="auth.user" @click="goPageProfile">Profil</button>
      <button v-else @click="goPageLogIn" class="btn-cta">Log in</button>
      <button @click="toggleDarkMode" class="dark-mode-toggle" :title="isDark ? 'Light Mode' : 'Dark Mode'">
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
