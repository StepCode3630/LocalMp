<template>
    <div class="profile">
        <h1>Modifier le profil</h1>

        <div v-if="loading">Loading...</div>
        <div v-else-if="error" class="error">Error: {{ error }}</div>
        <div v-else>
            <form @submit.prevent="submitForm" class="profile-form">
                <label for="fullName">Nom complet</label>
                <input id="fullName" v-model="fullName" type="text" placeholder="Nom complet" />

                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" placeholder="Email" />

                <button type="submit" class="btn-cta">Enregistrer</button>
                <button type="button" class="btn-secondary" @click="cancelEdit">Annuler</button>
            </form>

            <p class="success" v-if="successMessage">{{ successMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '@/api/apiPlaylist'
import { clearAuthCookie, getAuthHeaders } from '@/api/apiAuth'

const fullName = ref('')
const email = ref('')
const loading = ref(true)
const error = ref('')
const successMessage = ref('')

async function fetchProfile() {
    loading.value = true
    error.value = ''
    successMessage.value = ''

    try {
        const res = await fetch(`${API_BASE}/account/profile`, {
            credentials: 'include',
            headers: getAuthHeaders(),
        })
        if (!res.ok) {
            const txt = await res.text().catch(() => '')
            throw new Error(`Status ${res.status} ${txt}`)
        }
        const data = await res.json()
        fullName.value = data.data.fullName || ''
        email.value = data.data.email || ''
    } catch (err) {
        error.value = err.message || String(err)
    } finally {
        loading.value = false
    }
}

async function submitForm() {
    error.value = ''
    successMessage.value = ''

    try {
        const res = await fetch(`${API_BASE}/account/profile`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName: fullName.value, email: email.value }),
        })

        const body = await res.json().catch(() => null)
        if (!res.ok) {
            throw new Error(body?.error || body?.message || `Status ${res.status}`)
        }

        successMessage.value = 'Profil mis à jour avec succès.'
    } catch (err) {
        error.value = err.message || String(err)
    }
}

function cancelEdit() {
    window.location.href = '/profile'
}

async function logout() {
    try {
        await fetch(`${API_BASE}/account/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: getAuthHeaders(),
        })
    } catch (err) {
        console.error(err)
    }

    clearAuthCookie()
    try { window.dispatchEvent(new Event('auth-changed')) } catch (e) { }
    window.location.href = '/'
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile {
    max-width: 720px;
    margin: 24px auto;
}

.profile-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.profile-form label {
    font-weight: bold;
}

.profile-form input {
    padding: 10px;
    border: 1px solid var(--color-border);
    border-radius: 6px;
}

.btn-cta,
.btn-secondary {
    width: fit-content;
    padding: 10px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.btn-cta {
    background-color: var(--color-acid-black);
    color: white;
}

.btn-secondary {
    background-color: #e5e7eb;
    color: #111827;
}

.error {
    color: #b91c1c;
}

.success {
    color: #059669;
    margin-top: 12px;
}
</style>
