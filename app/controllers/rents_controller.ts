import { HttpContext } from "@adonisjs/core/http";
import Rent from "#models/rent";
import db from '@adonisjs/lucid/services/db'
import CirculatedBook from "#models/circulated_book";

export default class RentsController {
  public async borrow({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { circulated_ID } = request.body()
    const circulatedBook = await CirculatedBook.find(circulated_ID)
    const today = new Date()

    try {
      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "circulated Book not exist!"
        })
      }

      // check if the borrower is not the owner of the book
        if (user.id == circulatedBook.user_ID) {
          return response.status(403).json({
            code: 403,
            status: "Forbidden",
            message: "You can't rent your own book"
          })
        }

        const data = await db.rawQuery(
          'INSERT INTO rents (userID, Circulated_BookID, status, start_date, end_date) VALUES (:user,:circulated_ID,:status,:start_date,:end_date);',
          {
            user: user.id,
            circulated_ID: circulated_ID,
            status: 'pending',
            start_date: '',
            end_date: ''
          }
          )

        return response.status(200).json({
          code: 200,
          status: "success",
          data: data
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
