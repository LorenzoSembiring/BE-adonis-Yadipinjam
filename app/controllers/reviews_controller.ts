import UserReview from '#models/user_review'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import BookReview from '#models/book_review'

export default class ReviewsController {
  public async reviewOwner({ auth, request, response }: HttpContext) {
    try {
      const user = await auth.authenticate()
      const userID = user.id
      const { star, feedback, to } = request.body()

      // Memeriksa apakah user memberi review untuk dirinya sendiri
      if (userID == to) {
        return response.status(403).json({
          code: 403,
          status: 'forbidden',
          message: "you can't review yoursself"
        })
      }

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
        const review = await UserReview.create({
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
      const userID = user.id
      const { star, feedback, to } = request.body()

      // Memeriksa apakah user memberi review untuk dirinya sendiri
      if (userID == to) {
        return response.status(403).json({
          code: 403,
          status: 'forbidden',
          message: "you can't review yoursself"
        })
      }

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
        const review = await UserReview.create({
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
      const review = await UserReview.find(id)

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
        'SELECT * FROM `user_reviews` r WHERE r.type = "to owner" AND r.to = :owner;',
        {
          owner: id
        }
      )
      if (!review[0][0]) {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          message: 'review to this owner is not found',
        })
      }
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: review[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async getRenterReview({ auth, request, response }: HttpContext) {
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
        'SELECT * FROM `user_reviews` r WHERE r.type = "to renter" AND r.to = :renter;',
        {
          renter: id
        }
      )
      if (!review[0][0]) {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          message: 'review to this renter is not found',
        })
      }
      return response.status(200).json({
        code: 200,
        status: 'success',
        data: review[0],
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async createBookReview({ auth, request, response }: HttpContext) {
    const user = await auth.authenticate()
    const { circulated_ID, star, review } = request.body()
    try {
      const hasBorrowed = await db.rawQuery(
        'SELECT r.id FROM `rents` r JOIN `circulated_books` cb ON r.Circulated_BookID = cb.id WHERE cb.id = :book AND r.userID = :renter;',
        {
          book: circulated_ID,
          renter: user.id
        }
      )

      // if condition untuk pengecekan bahwa pengisi review adalah benar peminjam buku
      if (hasBorrowed[0][0]) {
        const data = await BookReview.create({
          circulated_id: circulated_ID,
          feedback: review,
          star: star,
          from: user.id
        })

        return response.status(201).json({
          code: 201,
          status: "created",
          data: data
        })
      } else {
        return response.status(403).json({
          code: 403,
          status: "forbidden",
          message: "You did not borrow this book!"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'Failed',
        error: error.message,
      })
    }
  }

  public async getBookReview({ request, response }: HttpContext) {
    const circulatedBookID = request.param('id')
    try {
      const review = await db.rawQuery(
        'SELECT br.*, u.username AS reviewer FROM `book_reviews` br JOIN `users` u on br.from = u.id WHERE br.circulated_id = :id',
        {
          id: circulatedBookID
        }
      )
      if (review[0][0]) {
        return response.status(200).json({
          code: 200,
          status:"success",
          data: review[0]
        })
      } else {
        return response.status(404).json({
          code: 404,
          status:"not found",
          message: "reviews not found"
        })
      }
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
