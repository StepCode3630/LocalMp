import { API_BASE } from './apiPlaylist'
import { reactive, ref } from 'vue'

const login = reactive({ email: '', password: '' })
const signup = reactive({ fullName: '', email: '', password: '', confirmPassword: '' })
const message = ref('')
const submitting = ref(false)

export { login, signup, message, submitting }

function getErrorMessage(data, fallback) {
  if (typeof data === 'string' && data) {
    return data
  }

  if (data?.message) {
    return data.message
  }

  if (data?.error) {
    return data.error
  }

  if (Array.isArray(data?.errors)) {
    return data.errors.map((item) => item?.message || item).join(' • ')
  }

  if (data?.errors && typeof data.errors === 'object') {
    return Object.entries(data.errors)
      .map(([field, value]) => `${field}: ${Array.isArray(value) ? value.join(', ') : value}`)
      .join(' • ')
  }

  return fallback
}

async function parseResponse(res) {
  const text = await res.text().catch(() => '')
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function submitLogin() {
  message.value = ''
  const email = String(login.email || '').trim()
  const password = String(login.password || '').trim()

  if (!email || !password) {
    message.value = 'Please fill in your email and password.'
    return
  }

  submitting.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })

    const data = await parseResponse(res)

    if (!res.ok) {
      throw new Error(getErrorMessage(data, `Login failed (${res.status})`))
    }

    if (data?.token) {
      localStorage.setItem('access_token', data.token)
    }

    message.value = 'Log in: ok.'
    try {
      window.dispatchEvent(new Event('auth-changed'))
    } catch (e) {}
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  } finally {
    submitting.value = false
  }
}

export async function submitSignup() {
  message.value = ''
  const fullName = String(signup.fullName || '').trim()
  const email = String(signup.email || '').trim()
  const password = String(signup.password || '').trim()
  const passwordConfirmation = String(signup.confirmPassword || '').trim()

  if (!fullName || !email || !password || !passwordConfirmation) {
    message.value = 'Please fill in all fields.'
    return
  }

  if (password !== passwordConfirmation) {
    message.value = 'Passwords do not match.'
    return
  }

  if (password.length < 8) {
    message.value = 'Password must be at least 8 characters long.'
    return
  }

  submitting.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        passwordConfirmation,
      }),
    })

    const data = await parseResponse(res)

    if (!res.ok) {
      throw new Error(getErrorMessage(data, `Signup failed (${res.status})`))
    }

    if (data?.token) {
      localStorage.setItem('access_token', data.token)
    }

    message.value = 'Sign in: ok.'
    try {
      window.dispatchEvent(new Event('auth-changed'))
    } catch (e) {}
  } catch (err) {
    message.value = 'Error: ' + (err.message || err)
  } finally {
    submitting.value = false
  }
}
