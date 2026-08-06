<template>
    <div class="profile">
        <div class="profile-card">
            <div class="profile-header">
                <div>
                    <p class="eyebrow">Mon compte</p>
                    <h1>Profile</h1>
                </div>
                <button @click="logout" class="btn-logout">Disconnect</button>
            </div>

            <div class="profile-content">
                <div v-if="loading" class="status">Loading...</div>
                <div v-else-if="error" class="status error">Error: {{ error }}</div>
                <div v-else>
                    <section class="user-info">
                        <button class="user-toggle clickable" @click="showUserInfo">
                            <span>User information</span>
                            <span class="arrow" :class="{ open: blnUserInfo }">›</span>
                        </button>
                        <div v-show="blnUserInfo" class="user-details">
                            <p><strong>ID:</strong> {{ user.data.id }}</p>
                            <p><strong>Name:</strong> {{ user.data.fullName }}</p>
                            <p><strong>Email:</strong> {{ user.data.email }}</p>
                            <!-- <p><strong>Initials:</strong> {{ user.data.initials }}</p> -->
                            <p><strong>Created at:</strong> {{ convertUtcHoursToLocal(user.data.createdAt) }}</p>
                            <!-- <p><strong>Updated at:</strong> {{ user.data.updatedAt }}</p> -->
                            <button @click="editProfile" class="btn-no-cta">Edit Profile</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { API_BASE } from '@/api/apiPlaylist'
import { clearAuthCookie, getAuthHeaders } from '@/api/apiAuth'

import moment from 'moment-timezone'

const user = ref(null)
const loading = ref(true)
const error = ref('')
const blnUserInfo = ref(false)

async function fetchProfile() {
    loading.value = true
    error.value = ''
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
        console.log('profile data:', data)
        user.value = data
    } catch (err) {
        error.value = err.message || String(err)
    } finally {
        loading.value = false
    }
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

function editProfile() {
    window.location.href = '/profile/edit'
}

function showUserInfo() {
    blnUserInfo.value = !blnUserInfo.value
}
function convertUtcHoursToLocal(userDate) {
    const utcDate = new Date(userDate)
    const localDate = moment.utc(utcDate).format('DD-MM-YYYY');
    return localDate
}

onMounted(fetchProfile)
</script>

<style scoped>
.profile {
    padding: 32px 16px;

}

.profile-card {
    width: 1200px;
    margin: 0 auto;
    padding: 28px;
    border-radius: 24px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
    border: 1px solid var(--color-border);
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
}

.profile-header h1 {
    margin: 0;
    font-size: 2rem;
    letter-spacing: -0.03em;
}

.eyebrow {
    margin: 0 0 6px;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
}

.profile-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.status {
    padding: 18px 16px;
    border-radius: 16px;
    color: #0968ec;
    font-weight: 500;
}

.status.error {
    color: #991b1b;
}

.user-info {
    display: grid;
    gap: 14px;
    padding: 18px;
    border-radius: 20px;
    border: 1px solid var(--color-border);
}

.user-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: none;
    background: transparent;
    padding: 0;
    font-size: 1.05rem;
    font-weight: 700;
}

.user-details {
    display: grid;
    gap: 10px;
    padding-top: 8px;
}

.user-details p {
    margin: 0;
    line-height: 1.7;
}

.btn-cta,
.btn-logout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 20px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.btn-cta {
    margin-top: 12px;
    color: white;
    box-shadow: 0 16px 34px rgba(37, 99, 235, 0.18);
}

.btn-cta:hover {
    transform: translateY(-1px);
}

.btn-logout {
    background: var(--color-heading);
    color: #0f172a;
}

.btn-logout:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.clickable {
    cursor: pointer;
    border-radius: 14px;
}

.clickable:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.arrow {
    display: inline-flex;
    transition: transform 0.2s ease;
}

.arrow.open {
    transform: rotate(90deg);
}

@media (max-width: 640px) {
    .profile {
        padding: 24px 12px;
    }

    .profile-card {
        padding: 24px;
        width: 100%;
    }

    .profile-header {
        flex-direction: column;
        align-items: stretch;
    }

    .btn-logout {
        width: 100%;
    }
}

@media (max-width: 1200px) {
    .profile-card {
        width: 640px;
        padding: 16px;
    }
}
</style>
