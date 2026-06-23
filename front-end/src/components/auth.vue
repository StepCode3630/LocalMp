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
import { ref, reactive } from 'vue'
import { submitLogin, submitSignup, login, signup, message } from '@/api/apiAuth'

const mode = ref('login')
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
