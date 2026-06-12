// Avoid requiring Adonis types here to prevent TS2307 in environments
// where @ioc:Adonis/Core/HttpContext type declarations are not available.
// Use a loose any type for the context parameter.
import { type HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import fs from 'node:fs'
import { ZipArchive } from 'archiver'
import { spawn } from 'node:child_process'
import type Stream from 'node:stream'

const YT_BATCH_STATS_URL = 'https://www.googleapis.com/youtube/v3/videos:batchGetStats'
const YT_BASE = 'https://youtube.googleapis.com/youtube/v3'
const YT_LINK = 'https://www.youtube.com'
const API_KEY = process.env.YOUTUBE_API_KEY
const MAX_BATCH = 50
export default class YouTubeController {
  public async playlist({ request, params, response }: HttpContext) {
    const playlistId = params.playlistId
    const pageToken = request.input('pageToken')
    if (!playlistId) {
      return response.status(400).json({ error: 'playlistId is required' })
    }

    try {
      // get playlist items — inclure contentDetails pour videoId fiable
      const res = await axios.get(`${YT_BASE}/playlistItems`, {
        params: {
          part: 'snippet,contentDetails',
          playlistId,
          maxResults: MAX_BATCH,
          pageToken,
          key: API_KEY,
        },
        timeout: 5000,
      })
      const items = res.data.items || []
      console.log(`Fetched ${items.length} items from playlist ${playlistId}`)

      // tenter d'obtenir le titre officiel/localisé de la playlist via l'endpoint playlists
      let playlistTitle = 'Unknown Playlist'
      try {
        const plRes = await axios.get(`${YT_BASE}/playlists`, {
          params: {
            part: 'snippet,contentDetails',
            id: playlistId,
            key: API_KEY,
          },
          timeout: 5000,
        })
        const plItem = plRes.data.items && plRes.data.items[0]
        playlistTitle = String(
          plItem?.snippet?.localized?.title ??
            plItem?.snippet?.title ??
            items[0]?.snippet?.title ??
            'Unknown Playlist'
        )
      } catch (e) {
        // si l'appel échoue, fallback sur le snippet du premier item
        playlistTitle = String(items[0]?.snippet?.title ?? 'Unknown Playlist')
      }

      // Extraire videoIds depuis contentDetails ou fallback vers snippet.resourceId
      const videoIds = items
        .map((item: any) => {
          if (item.contentDetails?.videoId) return item.contentDetails.videoId
          if (item.snippet?.resourceId?.videoId) return item.snippet.resourceId.videoId
          if (
            item.snippet?.resourceId?.kind === 'youtube#video' &&
            item.snippet?.resourceId?.videoId
          ) {
            return item.snippet.resourceId.videoId
          }
          return null
        })
        .filter(Boolean)
      console.log(`Extracted video IDs: ${videoIds.join(', ')}`)

      // Retourner uniquement les ids si l'appel demande seulement ça
      // (mais on continue la logique existante si on veut aussi les stats)
      if (request.input('onlyIds')) {
        return response.ok({ videoIds, nextPageToken: res.data.nextPageToken ?? null })
      }

      if (videoIds.length === 0) {
        return response.ok({
          videos: [],
          videoIds: [],
          nextPageToken: res.data.nextPageToken ?? null,
        })
      }

      // fetch videos details (en gardant comportement existant)
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

      const videos = vids.map((item: any) => {
        const snippet = item.snippet ?? {}
        const statistics = item.statistics ?? {}

        return {
          id: item.id ?? null,
          title: snippet.title ?? null,
          authorName: snippet.channelTitle ?? null,
          authorAvatar: null,
          thumbnail:
            snippet.thumbnails?.high?.url ??
            snippet.thumbnails?.standard?.url ??
            snippet.thumbnails?.default?.url ??
            null,
          duration: item.contentDetails?.duration ?? null,
          viewCount: statistics.viewCount ? Number(statistics.viewCount) : 0,
          likeCount: statistics.likeCount ? Number(statistics.likeCount) : 0,
          commentCount: statistics.commentCount ? Number(statistics.commentCount) : 0,
        }
      })

      // fetch channel avatars in parallel (inchangé)
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
        videos.forEach((v: { id: any; authorAvatar: string | null }) => {
          const chId = vids.find((x: any) => x.id === v.id)?.snippet?.channelId
          v.authorAvatar = chId ? (channelAvatarMap[chId] ?? null) : null
        })
      }

      // Retourne maintenant les videos, le titre de la playlist et la liste des videoIds
      return response.ok({
        playlist: {
          id: playlistId,
          title: playlistTitle,
        },
        titlePlaylist: playlistTitle,
        videos,
        videoIds,
        nextPageToken: res.data.nextPageToken ?? null,
      })
    } catch (err: any) {
      console.error('YouTube playlist error', err?.response?.data ?? err?.message ?? err)
      const status = err?.response?.status ?? 500
      return response.status(status).send({ error: 'Failed to fetch playlist' })
    }
  }
  public async streamZip({ request, response }: HttpContext) {
    const ids: string[] = request.input('ids') || []
    const format: 'mp4' | 'mp3' = request.input('format') === 'mp3' ? 'mp3' : 'mp4'

    if (!Array.isArray(ids) || ids.length === 0) {
      return response.badRequest({ error: 'ids is required' })
    }

    // Safety limits
    if (ids.length > 50) {
      return response.status(413).send({ error: 'Too many videos requested' })
    }

    // Ensure CORS headers are present when streaming directly to the raw Node response.
    // Some streaming libraries pipe directly to the underlying response and may
    // bypass headers added later. Reflect the request origin or fall back to '*'.
    const originHeader = request.header('origin') || '*'
    response.response.setHeader('Access-Control-Allow-Origin', originHeader)
    // If the frontend requires credentials, also allow them. Adjust as needed.
    response.response.setHeader('Access-Control-Allow-Credentials', 'true')
    response.response.setHeader('Content-Type', 'application/zip')
    response.response.setHeader(
      'Content-Disposition',
      `attachment; filename="LocalMp_videosYtbIn${format}.zip"`
    )

    const archive = new ZipArchive({ zlib: { level: 6 } })

    // Pipe archive to response stream
    archive.pipe(response.response)

    // Helper: spawn yt-dlp and return readable stream
    const spawnYtDlpStream = (videoId: string, fileName: string) => {
      const url = `${YT_LINK}/watch?v=${encodeURIComponent(videoId)}`

      // yt-dlp args: write to stdout with -o -, format selection; for mp3 use audio extraction
      let args: string[] = []
      if (format === 'mp4') {
        args = ['-f', 'best[ext=mp4]/best', '-o', '-', url]
      } else if (format === 'mp3') {
        args = ['-f', 'bestaudio', '--extract-audio', '--audio-format', 'mp3', '-o', '-', url]
      }

      // Allow overriding the binary path via env var, otherwise rely on PATH
      const exe = process.env.YT_DLP_PATH || 'yt-dlp'

      // Spawn process and return its stdout as stream
      const proc = spawn(exe, args, { stdio: ['ignore', 'pipe', 'pipe'] })

      proc.on('error', (err) => {
        console.error(`yt-dlp spawn error [${videoId}]:`, err)
      })

      proc.stderr.on('data', (d) => {
        console.error(`yt-dlp stderr [${videoId}]: ${d.toString()}`)
      })

      proc.on('exit', (code, signal) => {
        if (code && code !== 0) {
          console.error(`yt-dlp exited with code ${code} for ${videoId}`)
        }
        if (signal) {
          console.error(`yt-dlp killed by signal ${signal} for ${videoId}`)
        }
      })

      return proc.stdout as Stream.Readable
    }

    // archiver error handling
    archive.on('warning', (err: any) => {
      console.warn('Archive warning', err)
    })
    archive.on('error', (err: any) => {
      console.error('Archive error', err)
      try {
        // response may already be streaming; attempt to end connection
        response.status(500).send({ error: 'Failed to create archive' })
      } catch (e) {
        // ignore
      }
    })

    for (const id of ids) {
      const safeName = `LocalMp_${id}.${format}`
      try {
        const ytdlStream = spawnYtDlpStream(id, safeName)
        // If the spawned process fails immediately, listen for its error and append a text entry instead
        let appended = false
        ytdlStream.on &&
          ytdlStream.on('error', (err: any) => {
            console.error(`Stream error for ${id}:`, err)
            if (!appended) {
              archive.append(Buffer.from(`Failed to fetch ${id}\nError: ${String(err)}`), {
                name: `${id}.error.txt`,
              })
              appended = true
            }
          })

        archive.append(ytdlStream, { name: safeName })
      } catch (err: any) {
        archive.append(Buffer.from(`Failed to fetch ${id}\nError: ${String(err)}`), {
          name: `${id}.error.txt`,
        })
      }
    }

    archive.finalize()
  }
}
