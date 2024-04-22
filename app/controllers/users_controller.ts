import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import db from '@adonisjs/lucid/services/db'

export default class UsersController {
  public async register({ request, response }: HttpContext) {
    const { email, password, username, phone } = request.body()

    const existedUser = await User.query().where({ email: email }).first()
    if (existedUser) {
      return response.status(409).json({
        message: 'Email already taken',
      })
    }

    const user = await User.create({
      email: email,
      password: password,
      username: username,
      phone: phone,
      balance: 0,
      trust_point: 10,
      status: "active",
      role: role.user
    })

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days'
    })


    return response.status(200).json({
      code: '200',
      message: 'user successfully registered',
      data: {
        user,
        token,
      },
    })
  }

  public async login({ request, response }: HttpContext) {
    const { email, password } = request.body()

    const user = await User.query().where({ email: email }).first()

    try {
      if (!user) {
        return response.status(401).json({
          code: '401',
          message: 'Invalid email or password',
        })
      }

      if (!(await hash.verify(user.password, password))) {
        return response.status(401).json({
          code: '401',
          message: 'Invalid email or password',
        })
      }

      const token = await User.accessTokens.create(user, ['*'], {
        expiresIn: '30 days'
      })
      return response.status(200).json({
        code: '200',
        message: 'login success',
        data: {
          user,
          token,
        },
      })
    } catch (error) {
      return response.status(404).json({
        code: '404',
        message: error,
      })
    }
  }
  public async getUser({ auth, response }: HttpContext){
    try {
      const user = await auth.authenticate()
      return response.status(200).json({
        code: 200,
        status: "success",
        data: user
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error
      })
    }
  }
}

enum role {
  admin = "admin",
  user = "user"
}
