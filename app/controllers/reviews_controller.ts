import Review from '#models/review'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ReviewsController {
  public async reviewOwner({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { star, feedback, to } = request.body()

      // Memeriksa apakah user pernah meminjam buku dari pemilik (to)
      const hasBorrowed = await db.rawQuery(
        'SELECT * FROM `rents` r JOIN `circulated_books` c ON r.Circulated_BookID = c.id WHERE r.userID = :user AND c.user_ID = :owner',
        {
          user: user.id,
          owner: to,
        }
      )

      // Membuat review

      if (hasBorrowed[0][0]) {
        const review = await Review.create({
          star,
          feedback,
          to,
          from: user.id, // Menggunakan ID user yang terotentikasi sebagai peminjam
          type: types.owner,
        })
        return response.status(200).json({
          code: 200,
          message: 'a created successfully',
          data: review,
        })
      } else {
        return response.status(404).json({
          code: 404,
          message: 'You have not borrowed any books from this owner.',
        })
      }
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        return response.status(401).json({
          code: 401,
          message: 'Unauthorized access. Please login to continue.',
          error: error.message,
        })
      }
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async reviewRenter({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { star, feedback, to } = request.body()

      // Memeriksa apakah user pernah meminjam buku dari pemilik (to)
      const hasBorrowed = await db.rawQuery(
        'SELECT * FROM `rents` r JOIN `circulated_books` c ON r.Circulated_BookID = c.id WHERE r.userID = :renter AND c.user_ID = :user',
        {
          user: user.id,
          renter: to,
        }
      )

      // Membuat review

      if (hasBorrowed[0][0]) {
        const review = await Review.create({
          star,
          feedback,
          to,
          from: user.id, // Menggunakan ID user yang terotentikasi sebagai peminjam
          type: types.renter,
        })
        return response.status(200).json({
          code: 200,
          message: 'a created successfully',
          data: review,
        })
      } else {
        return response.status(404).json({
          code: 404,
          message: 'You have not borrowed any books from this owner.',
        })
      }
    } catch (error) {
      if (error.code === 'E_UNAUTHORIZED_ACCESS') {
        return response.status(401).json({
          code: 401,
          message: 'Unauthorized access. Please login to continue.',
          error: error.message,
        })
      }
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async getReview({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const id = request.param('id')
    try {
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          data: user,
        })
      }
      const review = await Review.find(id)

      return response.status(200).json({
        code: 200,
        status: 'success',
        data: review,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async getOwnerReview({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const id = request.param('id')
    try {
      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          data: user,
        })
      }
      const review = await db.rawQuery(
        'SELECT * FROM `reviews` r WHERE r.type = "to owner" AND r.to = :owner;',
        {
          owner: ownerID
        }
      )
      if (!review[0][0]) {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          message: '',
        })
      }
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: review[0][0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }
}

enum types {
  renter = 'to renter',
  owner = 'to owner',
}
