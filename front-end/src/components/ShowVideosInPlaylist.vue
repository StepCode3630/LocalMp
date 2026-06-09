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
            <label :for="video.id">{{ video.author }}</label>
            <img :src="video.thumbnail" alt="Thumbnail" class="thumbnail" />
          </div>
          <label :for="video.id">{{ video.duration }}</label>
          <img :src="video.imageVideo" alt="Video Thumbnail" class="thumbnail" />
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
  mounted() {
    // Fetch videos for the playlist when component mounts
    if (this.playlistId) {
      this.fetchPlaylistVideos(this.playlistId)
    }
  },
  methods: {
    fetchPlaylistVideos(playlistId) {
      // TODO: Call API to fetch videos for the playlist
      console.log('Fetching videos for playlist:', playlistId)
      // this.videos = ...
    },
  },
}
</script>
