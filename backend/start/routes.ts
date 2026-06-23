/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import User from '#models/user'
const TiktoksController = () => import('#controllers/tiktoks_controller')
const YouTubeController = () => import('#controllers/youtubes_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store'])
        router.post('login', [controllers.AccessTokens, 'store'])
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show'])
        router.post('logout', [controllers.AccessTokens, 'destroy'])
      })
      .prefix('account')
      .as('profile')
      .use(middleware.auth())

    // router.get('youtube/info', [YouTubeController, 'info2'])
    router.get('playlist/:playlistId', [YouTubeController, 'playlist'])
    router.get('playlistTikTok/:playlistId', [TiktoksController, 'playlist'])

    router.post('/download', [YouTubeController, 'streamZip'])
  })
  .prefix('/api/v1')
  .as('api')
router.post('/users/:id/tokens', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user)

  return token
})

/**
 * Response:
 * {
 *   "type": "bearer",
 *   "value": "oat_MTA.aWFQUmo2WkQzd3M5cW0zeG5JeHdiaV9rOFQzUWM1aTZSR2xJaDZXYzM5MDE4MzA3NTU",
 *   "expiresAt": null
 * }
 */
