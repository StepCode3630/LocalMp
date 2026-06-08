// Avoid requiring Adonis types here to prevent TS2307 in environments
// where @ioc:Adonis/Core/HttpContext type declarations are not available.
// Use a loose any type for the context parameter.
import { type HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import { time } from 'node:console'
import { TIMEOUT } from 'node:dns'

const YT_BASE = 'https://youtube.googleapis.com/youtube/v3'
const API_KEY = process.env.YOUTUBE_API_KEY
export default class YouTubeController {
  public async playlist({ request, params, response }: HttpContext) {
    const playlistId = params.playlistId
    const pageToken = request.input('pageToken')
    if (!playlistId) {
      return response.status(400).json({ error: 'playlistId is required' })
    }

    try {
      // get playlist items
      const res = await axios.get(`${YT_BASE}/playlistItems`, {
        params: {
          part: 'snippet',
          playlistId,
          maxResults: 10,
          pageToken,
          key: API_KEY,
        },
        timeout: 5000, // Set a timeout for the request
      })
      const items = res.data.items || []
      console.log(`Fetched ${items.length} items from playlist ${playlistId}`)

      const videoIds = items.map((item: any) => item.contentDetails?.videoId).filter(Boolean)
      console.log(`Extracted video IDs: ${videoIds.join(', ')}`)

      if (videoIds.length === 0) {
        return response.ok({ videos: [], nextPageToken: res.data.nextPageToken ?? null })
      }

      // fetch videos details
      const vidsRes = await axios.get(`${YT_BASE}/videos`, {
        params: {
          part: 'snippet,statistics,contentDetails',
          id: videoIds.join(','),
          maxResults: 50,
          key: API_KEY,
        },
        timeout: 20000,
      })

      const vids = vidsRes.data.items || []

      // Map video details back to playlist items
      const videos = vids.map((item: any) => {
        const snippet = item.snippet ?? {}
        const statistics = item.statistics ?? {}

        return {
          id: item.id ?? null,
          title: snippet.title ?? null,
          authorName: snippet.channelTitle ?? null,
          // authorAvatar: need channel's thumbnail -> snippet.channelId then call channels.list OR use snippet.thumbnails of playlistItems if available
          authorAvatar: null,
          thumbnail:
            snippet.thumbnails?.high?.url ??
            snippet.thumbnails?.standard?.url ??
            snippet.thumbnails?.default?.url ??
            null,
          duration: item.contentDetails?.duration ?? null,
          likeCount: statistics.likeCount ? Number(statistics.likeCount) : 0,
          commentCount: statistics.commentCount ? Number(statistics.commentCount) : 0,
          shareCount: statistics.shareCount ? Number(statistics.shareCount) : 0, // usually absent => 0
        }
      })

      // fetch channel avatars in parallel
      const channelIds = Array.from(
        new Set(vids.map((v: any) => v.snippet?.channelId).filter(Boolean))
      )
      if (channelIds.length) {
        const chRes = await axios.get(`${YT_BASE}/channels`, {
          params: {
            part: 'snippet',
            id: channelIds.join(','),
            key: API_KEY,
          },
          timeout: 20000,
        })

        const channels = chRes.data.items || []
        const channelAvatarMap: Record<string, string> = {}
        channels.forEach((c: any) => {
          channelAvatarMap[c.id] = c.snippet?.thumbnails?.default?.url ?? null
        })
        // attach avatar to videos
        videos.forEach((v: { id: any; authorAvatar: string | null }) => {
          const chId = vids.find((x: any) => x.id === v.id)?.snippet?.channelId
          v.authorAvatar = chId ? (channelAvatarMap[chId] ?? null) : null
        })
      }
      return response.ok({
        videos,
        nextPageToken: res.data.nextPageToken ?? null,
      })
    } catch (err: any) {
      console.error('YouTube playlist error', err?.response?.data ?? err?.message ?? err)
      const status = err?.response?.status ?? 500
      return response.status(status).send({ error: 'Failed to fetch playlist' })
    }
  }
}
