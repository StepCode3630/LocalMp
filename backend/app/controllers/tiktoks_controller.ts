// import type { HttpContext } from '@adonisjs/core/http'

import { type HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import { request } from 'node:http'

const TT_BASE_URL = 'https:///open.tiktokapis.com/v2/research/playlist/info'

export default class TiktoksController {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  public async playlist({ request, params, response }: HttpContext) {
    const playlistId = params.playlist_id
    const maxCount = request.input('max_count')
    if (!playlistId) {
      return response.status(400).json({ error: 'playlistId is required' })
    }
    try {
      const res = await axios.get(`${TT_BASE_URL}?fields`, {
        params: {
          playlistId,
        },
        timeout: 5000,
      })
      const items = res.data.items || []
      console.log(`Fetched ${items.length} items from playlist ${playlistId}`)
    } catch {
      console.log('rip')
    }
  }
}
