import Review from '#models/review'
import Rent from '#models/rent'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

export default class ReviewsController {
  public async reviewPemilik({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const { star, feedback, to, type } = request.body()

      // Memeriksa apakah user pernah meminjam buku dari pemilik (to)
      const hasBorrowed = await db.rawQuery("SELECT * FROM `rents` r JOIN `circulated_books` c ON r.Circulated_BookID = c.id WHERE r.userID = 1 AND c.user_ID = :owner",
        {
          user: user.id,
          owner: to
        }
      )

      // Membuat review

      if(hasBorrowed[0][0]) {
        const review = await Review.create({
          star,
          feedback,
          to,
          from: user.id,  // Menggunakan ID user yang terotentikasi sebagai peminjam
          type,
        })
        return response.status(200).json({
          code: 200,
          message: 'a created successfully',
          data: review
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
}
