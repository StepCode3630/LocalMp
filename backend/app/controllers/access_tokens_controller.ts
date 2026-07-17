import User from '#models/user'
import { loginValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

export default class AccessTokensController {
  async store({ response, request, serialize }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    // Generate access token
    const token = await User.accessTokens.create(user)
    console.log(token)
    const accessToken = token.value!.release()

    return response.json(
      serialize({
        user: UserTransformer.transform(user),
        accessToken,
      })
    )
  }

  async destroy({ response, auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }

    return response.json({
      message: 'Logged out successfully',
    })
  }
}
