import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'
import path from 'node:path'

export default class AccessTokensController {
  async store({ response, request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)
    const accessToken = token.value!.release()

    return response
      .cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true en prod https
        path: '/',
        maxAge: 60 * 60 * 1000, // 1h
      })
      .json(
        serialize({
          user: UserTransformer.transform(user),
        })
      )
  }

  async destroy({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return response.clearCookie('access_token').json({
      message: 'Logged out successfully',
      path: '/',
    })
  }
}
