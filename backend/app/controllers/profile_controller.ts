import User from '#models/user'
import UserTransformer from '#transformers/user_transformer'
import { updateProfileValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async show({ auth, serialize }: HttpContext) {
    try {
      return serialize(UserTransformer.transform(auth.getUserOrFail()))
    } catch (error) {
      return { error: 'User not authenticated' }
    }
  }

  async update({ request, auth, response, serialize }: HttpContext) {
    const user = auth.getUserOrFail()
    const { fullName, email } = await request.validateUsing(updateProfileValidator)

    if (email && email !== user.email) {
      const existingUser = await User.query().where('email', email).first()
      if (existingUser) {
        return response.badRequest({ error: 'Email already in use' })
      }
    }

    if (fullName !== undefined) {
      user.fullName = fullName
    }

    if (email !== undefined && email !== null) {
      user.email = email
    }

    await user.save()

    return serialize(UserTransformer.transform(user))
  }
}
