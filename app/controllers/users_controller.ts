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
      status: 'active',
      role: role.user,
    })

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
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
        expiresIn: '30 days',
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
  public async getUser({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: user,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async logout({ auth, response }: HttpContext) {
    try {
      const user = await auth.authenticate()

      const token = user.currentAccessToken
      console.log(token)
      const logout = await User.accessTokens.delete(user, token.identifier)

      return response.status(200).json({
        code: 200,
        status: 'success',
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async deleteUser({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    try {
      // Pastikan yang dapat menghapus user adalah admin
      if (user.role != 'admin') {
        return response.status(404).json({
          code: 404,
          status: 'anda bukan admin',
          data: user,
        })
      }

      // temukan user berdasarkan email
      const idUser = await User.find(params.id)

      // cek apakah user ada atau tidak
      if (!idUser) {
        return response.status(404).json({
          message: 'Not Found',
        })
      }

      await db.rawQuery('DELETE FROM users WHERE id=:idUser;', {
        idUser: params.id,
      })

      return response.status(200).json({
        code: 200,
        message: 'success',
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async indexUser({ auth, response }: HttpContext) {
    const user = await auth.authenticate()
    try {
      // Pastikan yang dapat menghapus user adalah admin
      if (user.role != 'admin') {
        return response.status(404).json({
          code: 404,
          status: 'anda bukan admin',
          data: user,
        })
      }

      var data = await db.rawQuery('SELECT * from users WHERE role= :role;', { role: role.user })

      return response.status(200).json({
        code: 200,
        message: 'success',
        data: data[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async userBook({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    try {
      // Pastikan yang dapat menghapus user adalah admin
      if (user.role != 'admin') {
        return response.status(404).json({
          code: 404,
          status: 'anda bukan admin',
          data: user,
        })
      }

      const idUser = await User.find(params.id)

      if (!idUser) {
        return response.status(404).json({
          message: 'Not Found',
        })
      }

      var data = await db.rawQuery(
        "SELECT cb.id as id_circulated, cb.books_ISBN, b.title, p.name as publisher, b.year, cb.description, GROUP_CONCAT(DISTINCT cp.path SEPARATOR ', ') AS image_links FROM circulated_books cb LEFT JOIN books b on cb.books_ISBN = b.ISBN LEFT JOIN publishers p ON b.publisher_ID= p.id LEFT JOIN circulated_pictures cp ON cb.id = cp.circulated_book_ID where cb.user_ID = :idUser GROUP BY cb.id, cb.books_ISBN, b.title, p.name, b.year, cb.description;",
        { idUser: params.id }
      )

      return response.status(200).json({
        code: 200,
        message: 'success',
        data: data[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async updateAdmin({ auth, request, response }: HttpContext) {
    const user = auth.authenticate()
    const userID = (await user).id
    const role = (await user).role
    const input = request.only(['email', 'username', 'phone', 'balance', 'status', 'trust_point'])
    try {
      if (role != 'admin') {
        return response.status(403).json({
          code: 403,
          status: 'forbidden',
          message: "your role access isn't sufficient to perform this action",
        })
      }

      const admin = await User.find(userID)
      admin?.merge(input)
      await admin?.save()

      return response.status(200).json({
        code: 200,
        status: "success",
        data: admin
      })

    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error.message,
      })
    }
  }
  public async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.authenticate()
    const userID = (await user).id
    const {password} = request.body()
    // const hashedPassword = hash.make(password)
    try {
      const userModel = await User.find(userID)
      if(userModel) {
        userModel.password = password
        await userModel?.save()

        return response.status(200).json({
          code: 200,
          status: 'success',
          message: "password successfully updated"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error.message,
      })
    }
  }

  public async updateUser({ auth, request, response }: HttpContext) {
    try {
      // Autentikasi pengguna
      const user = await auth.authenticate()

      // Validasi input
      const input = request.only(['email', 'username', 'phone'])

      // Cek pengguna berdasarkan ID
      const userToUpdate = await User.find(user.id)
      if (!userToUpdate) {
        return response.status(404).json({
          code: 404,
          status: 'Not Found',
          message: 'User not found',
        })
      }

      // Perbarui informasi pengguna
      userToUpdate.merge(input)
      await userToUpdate.save()

      return response.status(200).json({
        code: 200,
        status: 'success',
        data: userToUpdate,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error.message,
      })
    }
  }
}

enum role {
  admin = 'admin',
  user = 'user',
}
