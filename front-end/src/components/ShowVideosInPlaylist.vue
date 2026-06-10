<template>
  <div>
    <div v-if="!playlistId" class="no-playlist">
      <p>Aucune playlist sélectionnée. Entrez une URL et cliquez sur Search.</p>
    </div>

    <div v-else>
      <div class="controls">
        <button class="btn-cta" @click="$emit('select-all')">Select all</button>
        <button class="btn-no-cta" @click="$emit('deselect-all')">Deselect all</button>
      </div>

      <div v-if="loading">Chargement...</div>
      <div v-else-if="error" class="error">Erreur: {{ error }}</div>

      <div v-else>
        <p><strong>Total: </strong> {{ videos.length }}</p>
        <div v-for="video in videos" :key="video.id" class="video-item">
          <input
            type="checkbox"
            :id="video.id"
            :value="video.id"
            v-model="selectedVideos"
            @change="$emit('update:selectedVideos', selectedVideos)"
          />
          <div class="video-info">
            <a class="title" href="video.url" target="_blank" rel="noopener noreferrer">
              <label :for="video.id">{{ video.title }}</label>
            </a>
            <div class="meta">
              <span class="author">{{ video.authorName }}</span>
              <img :src="video.authorAvatar" alt="authorAvatar" class="thumbnailPP" />
            </div>
            <div class="thumb-row">
              <span class="duration">{{ video.duration }}</span>
              <img :src="video.thumbnail" alt="Video Thumbnail" class="thumbnailMinia" />
            </div>
            <div class="counts">
              <div>
                <img src="..//assets/like.svg" alt="Like" />
                <span class="likes">{{ video.likeCount }}</span>
              </div>
              <div>
                <img src="../assets/comment.svg" alt="Comment" />
                <span class="comments">{{ video.commentCount }}</span>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-cta" @click="$emit('download')">Download</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getPlaylists } from '@/api/apiPlaylist'

export default {
  name: 'ShowVideosInPlaylist',
  data() {
    return {
      videos: [],
      selectedVideos: [],
      playlistInfo: null,
      videoIds: [],
      loading: false,
      error: null,
    }
  },
  computed: {
    playlistId() {
      return this.$route?.params?.playlistId || null
    },
  },
  watch: {
    playlistId(newId, oldId) {
      if (newId && newId !== oldId) {
        this.loadOrFetch(newId)
      } else if (!newId) {
        this.reset()
      }
    },
  },
  mounted() {
    if (this.playlistId) this.loadOrFetch(this.playlistId)
  },
  methods: {
    reset() {
      this.videos = []
      this.selectedVideos = []
      this.playlistInfo = null
      this.videoIds = []
      this.loading = false
      this.error = null
    },
    formatDuration(seconds) {
      if (seconds === undefined || seconds === null || seconds === '') return 'N/A'
      if (typeof seconds === 'number') {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
      }
      const m = String(seconds).match(/PT(\d+H)?(\d+M)?(\d+S)?/)
      if (m) {
        const hours = m[1] ? parseInt(m[1]) : 0
        const mins = m[2] ? parseInt(m[2]) : 0
        const secs = m[3] ? parseInt(m[3]) : 0
        return `${hours > 0 ? hours + ':' : ''}${mins}:${secs.toString().padStart(2, '0')}`
      }
      return String(seconds)
    },
    async loadOrFetch(playlistId) {
      const cached = this.loadPlaylist(playlistId)
      if (cached) {
        this.playlistInfo = cached.playlistInfo ?? { id: playlistId }
        this.videoIds = cached.videoIds ?? []
        this.videos = (cached.videos ?? []).map((v) => ({
          ...v,
          duration: this.formatDuration(v.duration),
        }))
        return
      }
      await this.fetchPlaylistVideos(playlistId)
    },
    async fetchPlaylistVideos(playlistId) {
      this.loading = true
      this.error = null
      try {
        const res = await getPlaylists(playlistId)
        const vids = res?.videos ?? []
        this.playlistInfo = res?.playlist ?? { id: playlistId }
        this.videoIds = res?.videoIds ?? vids.map((x) => x.id).filter(Boolean)
        this.videos = vids.map((v) => ({ ...v, duration: this.formatDuration(v.duration) }))
        // persist
        try {
          const key = `localmp:playlist:${playlistId}`
          const payload = {
            playlistInfo: this.playlistInfo,
            videoIds: this.videoIds,
            videos: this.videos,
          }
          localStorage.setItem(key, JSON.stringify(payload))
        } catch (e) {
          console.warn('localStorage set failed', e)
        }
      } catch (err) {
        console.error('Failed to fetch playlist videos', err)
        this.error = err?.message ?? String(err)
        this.videos = []
      } finally {
        this.loading = false
      }
    },
    savePlaylist(playlistId, payload) {
      try {
        const key = `localmp:playlist:${playlistId}`
        localStorage.setItem(key, JSON.stringify(payload))
      } catch (err) {
        console.error('Error saving playlist to localStorage:', err)
      }
    },
    loadPlaylist(playlistId) {
      try {
        const key = `localmp:playlist:${playlistId}`
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : null
      } catch (err) {
        console.error('Error loading playlist from localStorage:', err)
        return null
      }
    },
  },
}
</script>

<style scoped>
.no-playlist {
  color: #666;
}
.video-item {
  border: var(--color-text) solid 1px;
  border-radius: 25px;
  padding: 15px;
  margin: 15px;
  /* keep the existing background as requested */
  background: linear-gradient(90deg, var(--color-acid-black) 0%, var(--color-acid-yellow) 100%);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #ffffff;
  width: 300px;
  margin: 20px;
  transition: all 0.2s ease;
}

.title:hover {
  text-decoration: underline;
  color: var(--color-acid-yellow);
  cursor: pointer;
  transition: all 0.3s ease;
}

.title label {
  cursor: pointer;
}
.thumbnailPP {
  width: auto;
  height: 100px;
  object-fit: cover;
  border-radius: 100%;
  margin-right: 30px;
}

.thumbnailMinia {
  width: auto;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
}

.video-info {
  margin-left: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: var(--color-text);
}
.video-info .meta {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  font-weight: 600;
}
.video-info .meta .author {
  color: var(--color-text);
}
.thumb-row {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
}
.duration {
  background: var(--color-text2);
  color: var(--color-text);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
}
.counts {
  display: flex;
  gap: 16px;
  margin-top: 6px;
  color: black;
  font-size: 0.9rem;
}
.controls {
  margin-bottom: 12px;
}
.error {
  color: #b00020;
}
</style>
