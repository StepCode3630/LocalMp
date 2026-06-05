import type { HttpContext } from '@adonisjs/core/http'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { URL } from 'node:url'

function isTikTokUrl(u: string) {
  try {
    const host = new URL(u).hostname.toLowerCase()
    return host.includes('tiktok.com') || host.includes('vm.tiktok.com')
  } catch {
    return false
  }
}
export default class DownloadController {
  public async handle({ request, response }: HttpContext) {
    const { url } = request.body()
    if (!url || typeof url !== 'string' || !isTikTokUrl(url)) {
      return response.badRequest({ error: 'URL invalide' })
    }

    // Fetch la page TikTok HTML
    let pageResp
    try {
      pageResp = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        redirect: 'follow',
      })
    } catch (err) {
      return response.internalServerError({ error: 'Impossible de récupérer la page' })
    }

    if (!pageResp.ok) {
      return response.status(502).json({ error: 'Erreur en récupérant TikTok' })
    }

    const html = await pageResp.text()

    // Extraire l'URL vidéo du HTML (approche: chercher le JSON embarqué "window['SIGI_STATE']" ou <script id="__NEXT_DATA__">)
    // On tente d'abord __NEXT_DATA__
    let videoUrl: string | null = null
    try {
      const $ = cheerio.load(html)
      const nextData = $('#__NEXT_DATA__').html()
      if (nextData) {
        const parsed = JSON.parse(nextData)
        // Parcourir parsed pour trouver videoData.playAddr ou similar
        // Structure varie; on fait une recherche profonde simple
        const searchForVideo = (obj: any): string | null => {
          if (!obj || typeof obj !== 'object') return null
          if (obj.playAddr && typeof obj.playAddr === 'string') return obj.playAddr
          if (obj.playUrl && typeof obj.playUrl === 'string') return obj.playUrl
          if (obj.urls && Array.isArray(obj.urls) && obj.urls[0]) return obj.urls[0]
          for (const k of Object.keys(obj)) {
            const res = searchForVideo(obj[k])
            if (res) return res
          }
          return null
        }
        videoUrl = searchForVideo(parsed)
      }
    } catch (e) {
      // ignore parse errors, on essaiera une autre stratégie
    }

    // Si pas trouvé, fallback: chercher dans html via regex pour "playAddr" ou "downloadAddr"
    if (!videoUrl) {
      const m = html.match(/"playAddr":"([^"]+)"/) || html.match(/"downloadAddr":"([^"]+)"/)
      if (m && m[1]) {
        // les urls sont souvent échappées (\/), on remplace
        videoUrl = m[1].replace(/\\\//g, '/')
      }
    }

    if (!videoUrl) {
      return response.status(500).json({ error: 'Impossible d’extraire l’URL vidéo' })
    }

    // Certaines URLs peuvent être relatives ou contenir des &u= etc. S'assurer qu'elle est complète
    if (!videoUrl.startsWith('http')) {
      // essayer de décoder
      try {
        videoUrl = decodeURIComponent(videoUrl)
      } catch {}
      if (!videoUrl.startsWith('http')) {
        // préfixer par https://v16.tiktokcdn.com/ comme fallback (non garanti)
        videoUrl = `https:${videoUrl}`
      }
    }

    // Fetcher l'asset média en stream et le pipe vers la réponse
    let mediaResp
    try {
      mediaResp = await fetch(videoUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36',
          'Referer': url,
        },
        redirect: 'follow',
      })
    } catch (err) {
      return response.internalServerError({ error: 'Impossible de récupérer la vidéo' })
    }

    if (!mediaResp.ok || !mediaResp.body) {
      return response.status(502).json({ error: 'Erreur lors du téléchargement du média' })
    }

    // Propager content-type et taille si présents
    const ct = mediaResp.headers.get('content-type') || 'application/octet-stream'
    const cl = mediaResp.headers.get('content-length')
    response.header('Content-Type', ct)
    if (cl) response.header('Content-Length', cl)
    response.header('Content-Disposition', 'attachment; filename="tiktok.mp4"')

    // Streamer la réponse (Node stream)
    const nodeStream = mediaResp.body as any
    const nativeRes = (response as any).res || (response as any).response
    await new Promise<void>((resolve, reject) => {
      nodeStream.pipe(nativeRes)
      nodeStream.on('end', () => resolve())
      nodeStream.on('error', (err: any) => reject(err))
      nativeRes.on && nativeRes.on('close', () => resolve())
    })
  }
}
