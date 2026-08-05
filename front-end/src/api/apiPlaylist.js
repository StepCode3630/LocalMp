export const API_BASE = 'http://localhost:3333/api/v1'

export async function getPlaylists(playlistId, opts = {}) {
  const encodedId = encodeURIComponent(playlistId)
  const url = `${API_BASE}/playlist/${encodedId}${opts.onlyIds ? '?onlyIds=1' : ''}`

  const controller = new AbortController()
  const timeout = opts.timeout ?? 15000
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
    console.log('Response status:', response.status)
    if (!response.ok) {
      const text = await response.text().catch(() => null)
      throw new Error(`Failed to fetch playlists: ${response.status} ${text ?? ''}`)
    }
    return await response.json()
  } finally {
    clearTimeout(id)
  }
}
