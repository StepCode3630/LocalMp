<template>
  <div class="auth-container">
    <div class="card">
      <div class="tabs">
        <button :class="{ active: mode === 'login' }" @click="mode = 'login'">Log in</button>
        <button :class="{ active: mode === 'signup' }" @click="mode = 'signup'">Sign in</button>
      </div>

      <form v-if="mode === 'login'" @submit.prevent="submitLogin" class="form">
        <label>Email</label>
        <input v-model="login.email" type="email" required />

        <label>Mot de passe</label>
        <input v-model="login.password" type="password" required />

        <button class="btn-cta forms-btn" type="submit">Log in</button>
      </form>

      <form v-else @submit.prevent="submitSignup" class="form">
        <label>Full name</label>
        <input v-model="signup.fullName" type="text" required />

        <label>Email</label>
        <input v-model="signup.email" type="email" required />

        <label>Password</label>
        <input v-model="signup.password" type="password" required />

        <label>Confirm password</label>
        <input v-model="signup.confirmPassword" type="password" required />

        <button class="btn-cta forms-btn" type="submit">Create account</button>
      </form>

      <p class="message" v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { API_BASE } from '@/api/apiPlaylist'
import { ref, reactive } from 'vue'

const mode = ref('login')
const message = ref('')

const login = reactive({ email: '', password: '' })
const signup = reactive({ fullName: '', email: '', password: '', confirmPassword: '' })

const backendBase = import.meta.env.VITE_API_BASE || API_BASE

async function submitLogin() {
  message.value = ''
  try {
    const res = await fetch(`${backendBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: login.email, password: login.password }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || JSON.stringify(data))

    const token = data.token || data?.data?.token
    if (token) {
      localStorage.setItem('token', token)
      message.value = 'Log in: ok.'
    } else {
      message.value = 'log in: ok'
    }
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  }
}

async function submitSignup() {
  message.value = ''
  try {
    const res = await fetch(`${backendBase}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: signup.fullName,
        email: signup.email,
        password: signup.password,
        confirmPassword: signup.confirmPassword,
      }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data?.message || JSON.stringify(data))

    const token = data.token || data?.data?.token
    if (token) {
      localStorage.setItem('token', token)
      message.value = 'Account create and log in'
      mode.value = 'login'
    } else {
      message.value = 'Sign in: ok'
    }
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  }
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.card {
  width: 360px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 1px 6px 18px var(--color-shadow);
  background: var(--color-background);
}
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.tabs button {
  flex: 1;
  padding: 8px;
  border: none;
  background: var(--color-background);
  cursor: pointer;
  color: var(--color-text);
}
.tabs button.active {
  background: var(--color-acid-black);
  color: var(--color-text2);
}
.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}
.form input {
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.forms-btn {
  width: 167px;
}

.message {
  margin-top: 12px;
  color: #059669;
}
</style>
