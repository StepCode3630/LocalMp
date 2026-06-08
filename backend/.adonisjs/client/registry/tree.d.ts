/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  api: {
    auth: {
      newAccount: {
        store: typeof routes['api.auth.new_account.store']
      }
      accessTokens: {
        store: typeof routes['api.auth.access_tokens.store']
      }
    }
    profile: {
      profile: {
        show: typeof routes['api.profile.profile.show']
      }
      accessTokens: {
        destroy: typeof routes['api.profile.access_tokens.destroy']
      }
    }
    youTube: {
      playlist: typeof routes['api.you_tube.playlist']
    }
  }
}
