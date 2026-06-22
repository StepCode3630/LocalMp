<template>
  <h1>Local Media Downloader mp3 & mp4</h1>

  <form class="home-link-container" @submit.prevent="search">
    <p class="description">
      Enter a link to a public album, choose between MP3 and MP4, select the platform, and download
      all the videos. You can log to see your albums and in to download private albums.
    </p>

    <div class="platform-selector">
      <button type="button" :class="{ active: platform === 'tiktok' }" @click="platform = 'tiktok'">
        <img class="icon" src="../assets/tiktok-svgrepo-com.svg" alt="TikTok" />
        TikTok
        <span
          class="info-btn"
          @mouseenter="showTooltip = 'tiktok'"
          @mouseleave="showTooltip = null"
        >
          <img class="info" src="../assets/info-circle-svgrepo-com.svg" alt="info" />
          <div v-if="showTooltip === 'tiktok'" class="tooltip">
            Download videos and audio from TikTok
          </div>
        </span>
      </button>
      <button
        type="button"
        :class="{ active: platform === 'youtube' }"
        @click="platform = 'youtube'"
      >
        <img class="icon" src="../assets/youtube-color-svgrepo-com.svg" alt="YouTube" />
        YouTube
        <span
          class="info-btn"
          @mouseenter="showTooltip = 'youtube'"
          @mouseleave="showTooltip = null"
        >
          <img class="info" src="../assets/info-circle-svgrepo-com.svg" alt="info" />
          <div v-if="showTooltip === 'youtube'" class="tooltip">
            Download videos and audio from YouTube <br />
            Max 50 videos per playlist
          </div>
        </span>
      </button>
    </div>

    <div class="input-section">
      <input v-model="url" type="text" placeholder="Enter link here..." />
      <button type="submit" class="btn-cta" :disabled="!playlistId">Search</button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue'
import { getPlaylists } from '@/api/apiPlaylist'

//////TEST !!!!
const TT_BASE_URL = 'https:///open.tiktokapis.com/v2/research/playlist/info'

try {
  fetch(TT_BASE_URL + 11 + 'sdjsdjsjdjjs')
  console.log('fetch tttttt ok👌')
} catch {
  console.log('fetch tttttt pas ok😒')
}

export function extractPlaylistIdYtb(url) {
  const youtubeMatch = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
  if (youtubeMatch) {
    return youtubeMatch[1]
  }
  return null
}

export default {
  name: 'HomeLink',
  data() {
    return {
      platform: 'youtube',
      url: '',
      showTooltip: null,
    }
  },
  methods: {
    // extractPlaylistIdYtb(url) {
    //   // This function would contain logic to extract the playlist ID from the URL
    //   // For example, for YouTube it might look for "list=" in the URL and extract the following string
    //   // For TikTok, it might look for a specific pattern in the URL
    //   // This is a placeholder implementation and should be expanded based on actual URL formats
    //   const youtubeMatch = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
    //   if (youtubeMatch) {
    //     return youtubeMatch[1]
    //   }
    //   return null
    // },
    search() {
      if (!this.url.trim()) return
      const id = extractPlaylistIdYtb(this.url)
      if (!id) {
        // no playlist id found; inform the user
        console.warn('No playlistId could be extracted from URL')
        return
      }
      console.log(`Downloading ${this.format} from ${this.platform}: ${this.url}`)
      getPlaylists(id)
        .then((response) => {
          console.log('Playlists retrieved:', response)
          // navigate to Show route with the found playlistId
          if (this.$router) {
            this.$router.push({ name: 'Show', params: { playlistId: id } })
          }
        })
        .catch((error) => {
          console.error('Error retrieving playlists:', error)
        })
    },
  },

  computed: {
    playlistId() {
      return extractPlaylistIdYtb(this.url)
    },
  },
}
</script>

<style scoped>
.home-link-container {
  max-width: 800px;
  margin: 50px auto;
  padding: 30px;
  background: var(--color-background-soft);
  border-radius: 15px;
  box-shadow: 0 10px 30px var(--color-shadow);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.platform-selector {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.platform-selector button {
  padding: 12px 30px;
  border: 0px solid transparent;
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.platform-selector button:hover {
  transition: all 0.3s ease;
  box-shadow:
    0 12px 24px var(--color-shadow),
    -6px -6px 20px var(--color-shadow);
}

.platform-selector button.active {
  font-weight: bold;
  box-shadow:
    0 2px 4px var(--color-shadow),
    inset 0 -6px 10px var(--color-shadow);
}

.info-btn {
  cursor: help;
  font-size: 1rem;
  position: relative;
  display: inline-flex;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.9rem;
  z-index: 10;
  animation: fadeIn 0.3s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.9);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.input-section input {
  flex: 1;
  padding: 12px 15px;
  border: 0px solid transparent;
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.3s ease;
}

.input-section input::placeholder {
  color: var(--color-text);
  opacity: 0.6;
}

.input-section input:focus {
  outline: none;
  box-shadow:
    #000 0px 0px 0px 2px,
    inset 0 1px rgba(255, 255, 255, 0.1);
}

.info {
  width: 22px;
  height: 22px;
}
.description {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 30px;
  color: var(--color-text);
}
</style>
