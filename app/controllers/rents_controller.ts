import { HttpContext } from "@adonisjs/core/http";
import Rent from "#models/rent";
import db from '@adonisjs/lucid/services/db'
import CirculatedBook from "#models/circulated_book";

export default class RentsController {
  public async borrow({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { circulated_ID } = request.body()
    const circulatedBook = await CirculatedBook.find(circulated_ID)
    const today = new Date
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    try {
      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "circulated Book not exist!"
        })
      }

      // check if the borrower is not the owner of the book
      const user_ID = circulatedBook['$extras']['user_ID']
      if (user.id == user_ID) {
        return response.status(403).json({
          code: 403,
          status: "Forbidden",
          message: "You can't rent your own book"
        })
      }

      // check if the borrower is already rented that book
      const existingRent = await db.rawQuery(
        'SELECT * FROM rents WHERE userID = :user AND Circulated_BookID = :circulated_ID;',
        {
          user: user.id,
          circulated_ID: circulated_ID
        }
      );

      if (existingRent && existingRent.length > 0) {
        return response.status(403).json({
          code: 403,
          status: "Forbidden",
          message: "You already rent this book"
        });
      }

      const data = await db.rawQuery(
        'INSERT INTO rents (userID, Circulated_BookID, status, start_date, end_date) VALUES (:user,:circulated_ID,:status,:start_date,:end_date);',
        {
          user: user.id,
          circulated_ID: circulated_ID,
          status: 'pending',
          start_date: today,
          end_date: nextWeek
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

  public async confirmReturn({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { rent_ID } = request.body()
    const rent = await Rent.find(rent_ID)

    try {
      if (!rent) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Rent not found!"
        });
      }
      // Mengecek apakah pengguna yang meminta konfirmasi adalah pemilik buku
      const circulatedBook = rent['$extras']['Circulated_BookID'];
      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Circulated book not found!"
        });
      }
      const user_ID = rent['$extras']['userID']
      console.log(user_ID, user.id);
      if (user.id !== user_ID) {
        return response.status(403).json({
          code: 403,
          status: "Forbidden",
          message: "You are not authorized to confirm return for this book"
        });
      }

      // Mengubah status sewa menjadi "returned"
      rent.status = "returned";
      await rent.save()

      return response.status(200).json({
        code: 200,
        status: "success",
        message: "Book return confirmed"
      });
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error.message
      });
    }
  }

  public async confirmBorrow({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const { rent_ID } = request.body()
    const rent = await Rent.find(rent_ID)

    try {
      if (!rent) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Rent not found!"
        });
      }
      // Mengecek apakah pengguna yang meminta konfirmasi adalah pemilik buku
      const circulatedBook = rent['$extras']['Circulated_BookID'];
      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          status: "not found",
          message: "Circulated book not found!"
        });
      }
      const user_ID = rent['$extras']['userID']
      console.log(user_ID, user.id);
      if (user.id !== user_ID) {
        return response.status(403).json({
          code: 403,
          status: "Forbidden",
          message: "You are not authorized to confirm rent for this book"
        });
      }

      // Mengubah status sewa menjadi "returned"
      rent.status = "confirmed";
      await rent.save()

      return response.status(200).json({
        code: 200,
        status: "success",
        message: "Book rent confirmed"
      });
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error.message
      });
    }
  }
  public async renterStatus({ request, response, auth }: HttpContext) {
    const type = request.param('type')
    const user = await auth.authenticate()
    try {
      const data = await db.rawQuery(
        'SELECT * FROM `rents` WHERE status = :status AND userID = :user;',
        {
          status: type,
          user: user.id
        }
      );
      return response.status(200).json({
        code: 200,
        message: "success",
        data: data[0]
      });
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error.message
      });
    }
  }
}
