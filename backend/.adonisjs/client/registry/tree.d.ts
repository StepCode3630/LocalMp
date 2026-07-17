/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  api: {
    auth: {
      signup: typeof routes['api.auth.signup']
      login: typeof routes['api.auth.login']
    }
    profile: {
      show: typeof routes['api.profile.show']
      logout: typeof routes['api.profile.logout']
    }
    playlist: typeof routes['api.playlist']
    playlistTikTok: typeof routes['api.playlistTikTok']
    download: typeof routes['api.download']
  }
}
