<style scoped></style>
<template>
  <div v-if="playlistId">
    <button class="btn-cta" @click="$emit('select-all')">Select all</button>
    <button class="btn-no-cta" @click="$emit('deselect-all')">Deselect all</button>
    <div>
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
          <label :for="video.id">{{ video.title }}</label>
          <div>
            <label :for="video.id">{{ video.authorName }}</label>
            <img :src="video.authorAvatar" alt="authorAvatar" class="thumbnail" />
          </div>
          <label :for="video.id">{{ video.duration }}</label>
          <img :src="video.thumbnail" alt="Video Thumbnail" class="thumbnail" />
          <div>
            <div>
              <img src="../assets/like.svg" alt="Likes" class="icon" />
              <label :for="video.id">{{ video.likeCount }}</label>
            </div>
            <div>
              <img src="../assets/comment.svg" alt="Comments" class="icon" />
              <label :for="video.id">{{ video.commentCount }}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="btn-cta" @click="$emit('download')">Download</button>
  </div>
  <div v-else class="no-playlist">
    <p>Aucune playlist sélectionnée. Entrez une URL et cliquez sur Search.</p>
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
    }
  },
  computed: {
    playlistId() {
      return this.$route.params.playlistId
    },
  },
  watch: {
    playlistId(newId, oldId) {
      if (newId && newId !== oldId) {
        this.fetchPlaylistVideos(newId)
      } else if (!newId) {
        this.videos = []
        this.selectedVideos = []
      }
    },
  },
  mounted() {
    // Fetch videos for the playlist when component mounts
    if (this.playlistId) {
      this.fetchPlaylistVideos(this.playlistId)
    }
  },
  methods: {
    formatDuration(seconds) {
      if (
        seconds === undefined ||
        seconds === null ||
        seconds === '' ||
        typeof seconds !== 'number'
      )
        return 'N/A'
      if (typeof seconds == 'number') {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
      }

      const m = seconds.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
      if (m) {
        const hours = m[1] ? parseInt(m[1]) : 0
        const mins = m[2] ? parseInt(m[2]) : 0
        const secs = m[3] ? parseInt(m[3]) : 0
        return `${hours > 0 ? hours + ':' : ''}${mins}:${secs.toString().padStart(2, '0')}`
      }
      return 'N/A'
    },
    async fetchPlaylistVideos(playlistId) {
      console.log('Fetching videos for playlist:', playlistId)
      try {
        const res = await getPlaylists(playlistId)
        const vids = res?.videos ?? []
        // map duration to a readable format
        this.videos = vids.map((v) => ({
          ...v,
          duration: this.formatDuration(v.duration),
        }))
      } catch (err) {
        console.error('Failed to fetch playlist videos', err)
        this.videos = []
      }
    },
  },
}
</script>
