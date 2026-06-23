import { API_BASE } from './apiPlaylist'
import { reactive, ref } from 'vue'

const login = reactive({ email: '', password: '' })
const signup = reactive({ fullName: '', email: '', password: '', confirmPassword: '' })
const message = ref('')
export { login, signup, message }

export async function submitLogin() {
  message.value = ''
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login.email,
        password: login.password,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || 'Login failed')
    }

    message.value = 'Log in: ok.'
    // notify other parts of the app that auth state changed
    try {
      window.dispatchEvent(new Event('auth-changed'))
    } catch (e) {}
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  }
}

export async function submitSignup() {
  message.value = ''
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: signup.fullName,
        email: signup.email,
        password: signup.password,
        passwordConfirmation: signup.confirmPassword,
      }),
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data?.message || 'Signup failed')
    }

    message.value = 'Sign in: ok.'
    // notify other parts of the app that auth state changed
    try {
      window.dispatchEvent(new Event('auth-changed'))
    } catch (e) {}
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  }
}
