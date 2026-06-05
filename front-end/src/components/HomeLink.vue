<template>
  <h1>Local Media Downloader mp3 & mp4</h1>

  <div class="home-link-container">
    <p class="description">
      Enter a link to a public album, choose between MP3 and MP4, select the platform, and download
      all the videos. You can log to see your albums and in to download private albums.
    </p>
    <div class="format-toggle">
      <button :class="{ active: format === 'mp3' }" @click="format = 'mp3'" class="toggle-btn">
        MP3
      </button>
      <button :class="{ active: format === 'mp4' }" @click="format = 'mp4'" class="toggle-btn">
        MP4
      </button>
    </div>

    <div class="platform-selector">
      <button :class="{ active: platform === 'tiktok' }" @click="platform = 'tiktok'">
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
      <button :class="{ active: platform === 'youtube' }" @click="platform = 'youtube'">
        <img class="icon" src="../assets/youtube-color-svgrepo-com.svg" alt="YouTube" />
        YouTube
        <span
          class="info-btn"
          @mouseenter="showTooltip = 'youtube'"
          @mouseleave="showTooltip = null"
        >
          <img class="info" src="../assets/info-circle-svgrepo-com.svg" alt="info" />
          <div v-if="showTooltip === 'youtube'" class="tooltip">
            Download videos and audio from YouTube
          </div>
        </span>
      </button>
    </div>

    <div class="input-section">
      <input v-model="url" type="text" placeholder="Enter link here..." @keyup.enter="search" />
      <button @click="search" class="btn-cta">Search</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeLink',
  data() {
    return {
      format: 'mp3',
      platform: 'youtube',
      url: '',
      showTooltip: null,
    }
  },
  methods: {
    search() {
      if (this.url.trim()) {
        console.log(`Downloading ${this.format} from ${this.platform}: ${this.url}`)
        // logic downloading media based on selected format and platform would go here
      }
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

.format-toggle {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 30px;
  background: var(--color-toggle2);
  padding: 6px;
  border-radius: 25px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.toggle-btn {
  padding: 10px 20px;
  border: none;
  background: transparent;
  color: var(--color-toggle);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toggle-btn:hover:not(.active) {
  color: white;
}

.toggle-btn.active {
  background: var(--color-toggle);
  color: var(--color-toggle2);
  font-weight: 700;
  box-shadow: 0 2px 8px var(--color-toggle2);
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
  font-size: 1.1rem;
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
