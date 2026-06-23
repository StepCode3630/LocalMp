<template>
    <div class="profile">
        <h2>Mon profil</h2>
        <div v-if="loading">Chargement...</div>
        <div v-else-if="error" class="error">Erreur: {{ error }}</div>
        <div v-else>
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Nom:</strong> {{ user.fullName }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Initiales:</strong> {{ user.initials }}</p>
            <p><strong>Créé le:</strong> {{ user.createdAt }}</p>
            <p><strong>Mis à jour:</strong> {{ user.updatedAt }}</p>

            <button @click="logout" class="btn-cta">Se déconnecter</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '@/api/apiPlaylist'

const user = ref(null)
const loading = ref(true)
const error = ref('')

async function fetchProfile() {
    loading.value = true
    error.value = ''
    try {
        const res = await fetch(`${API_BASE}/account/profile`, { credentials: 'include' })
        if (!res.ok) {
            const txt = await res.text().catch(() => '')
            throw new Error(`Status ${res.status} ${txt}`)
        }
        user.value = await res.json()
    } catch (err) {
        error.value = err.message || String(err)
    } finally {
        loading.value = false
    }
}

async function logout() {
    await fetch(`${API_BASE}/account/logout`, { method: 'POST', credentials: 'include' })
    // notify app and redirect to home
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

.error {
    color: #b91c1c
}

.btn-cta {
    margin-top: 12px
}
</style>
