import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'
import db from '@adonisjs/lucid/services/db'
import Book from '#models/book'
import BookAuthor from '#models/book_author'
import Publisher from '#models/publisher'
import Author from '#models/author'
import CirculatedBook from '#models/circulated_book'

import PublishersController from '#controllers/publishers_controller'
import AuthorsController from './authors_controller.js'
import CirculatedPicture from '#models/circulated_picture'
import app from '@adonisjs/core/services/app'
import { error } from 'console'
import { messages } from '@vinejs/vine/defaults'

export default class BooksController {
  public async fetchGoogleAPI({ request, response }: HttpContext) {
    const { ISBN } = request.body()
    const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN
    try {
      const res = await axios.get(url)

      if (res.data.totalItems > 0) {
        const title: string = res.data.items[0].volumeInfo.title
        const authors: Array<string> = res.data.items[0].volumeInfo.authors
        const publisher: string = res.data.items[0].volumeInfo.publisher
        const publishedDate: string = res.data.items[0].volumeInfo.publishedDate

        const data = {
          title: title,
          authors: authors,
          publisher: publisher,
          date: publishedDate,
        }

        return response.status(200).json({
          code: 200,
          message: 'success',
          data: data,
        })
      } else {
        return response.status(200).json({
          code: 200,
          message: 'not found',
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }

  public async createBookAuthor(ISBN: string, author_ID: number) {
    try {
      const data = await BookAuthor.create({
        author_ID: author_ID,
        books_ISBN: ISBN,
      })
      return data
    } catch (error) {
      return null
    }
  }

  public async getBookByISBN(ISBN: string) {
    try {
      const data = await Book.findByOrFail('ISBN', ISBN)
      if (data) {
        return data
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }
  //this code bellow will cretae book entity that acted as master data, it will called when someone uploading their book

  public async createBook(
    ISBN: string,
    authors: string[],
    publisher: string,
    year: number,
    title: string,
    imagelink: string
  ) {
    const publishersController = new PublishersController()
    const authorsController = new AuthorsController()
    // const { ISBN, authors, publisher, year, title} = request.body()
    const trx = await db.transaction()

    const bookData = await Book.findBy('ISBN', ISBN)
    try {
      // retrieve publisher data based on name, create if not exist
      const publisherData = await Publisher.findBy('name', publisher)

      if (publisherData) {
        var publisher_ID: number | null = publisherData.id
      } else {
        var publisher_ID: number | null = await publishersController.create(publisher)
      }

      //check the publisher not null
      if (publisher_ID && !bookData) {
        var book = await Book.create({
          ISBN: ISBN,
          title: title,
          publisher_ID: publisher_ID,
          year: year,
          imagelink: imagelink,
        })
      } else {
        return 'Book existed'
      }

      // retrieve author data based on name, create if not exist
      // create bookAuthor after author exist
      for (let index = 0; index < authors.length; index++) {
        const authorData = await Author.findBy('name', authors[index])
        if (authorData) {
          var author_ID: number | null = authorData.id
        } else {
          var author_ID: number | null = await authorsController.create(authors[index])
        }
        if (author_ID) {
          await this.createBookAuthor(ISBN, author_ID)
        }
      }

      await trx.commit()

      return book!
    } catch (error) {
      await trx.rollback()
      return null
    }
  }
  public async fetchImage(ISBN: string) {
    const url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + ISBN
    try {
      const res = await axios.get(url)
      const imagelink = res.data.items[0].volumeInfo.imageLinks.thumbnail
      return imagelink
    } catch (error) {
      return null
    }
  }

  public async uploadBook({ request, response, auth }: HttpContext) {
    const trx = await db.transaction()

    const { ISBN, authors, publisher, year, title, description, price } = request.body()
    const authorArray: string[] = authors.split('?')
    const bookCheck = this.getBookByISBN(ISBN)
    const user = await auth.authenticate()

    try {
      let imagelink = null
      const fetchImageResult = await this.fetchImage(ISBN)
      if (fetchImageResult) {
        imagelink = fetchImageResult
      }
      // if the book is exist, just create the circulated_book
      // if not, create book first
      if (!(await bookCheck)) {
        await this.createBook(ISBN, authorArray, publisher, year, title, imagelink)
      }

      const data = await CirculatedBook.create({
        description: description,
        price: price,
        status: 'inactive',
        books_ISBN: ISBN,
        user_ID: user.id,
      })

      const uploadImages = request.files('image')

      if (uploadImages) {
        const uploadedPictures = []

        for (const image of uploadImages) {
          await image.move(app.makePath('uploads'))

          const pictureFileName = image.fileName

          const picture = await CirculatedPicture.create({
            circulated_book_ID: data.id,
            path: pictureFileName,
          })

          uploadedPictures.push(picture)
        }

        await trx.commit()

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data,
          pictures: uploadedPictures,
        })
      } else {
        return response.status(400).json({
          code: 400,
          status: 'not found',
        })
      }
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }
  public async bookIndex({ response, auth }: HttpContext) {
    const user = await auth.authenticate()
    try {
      console.log(user.id)
      if (user) {
        var data = await db.rawQuery(
          "SELECT DISTINCT b.* FROM `circulated_books` AS cb JOIN `users` AS u ON cb.user_ID = u.id JOIN `books` AS b ON cb.books_ISBN = b.ISBN WHERE u.id != :user OR cb.status = 'active' LIMIT 10 OFFSET 1;",
          {
            user: user.id,
          }
        )
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0],
        })
      } else {
        var data = await db.rawQuery(
          "SELECT DISTINCT b.* FROM books b JOIN circulated_books cb ON cb.books_ISBN = b.ISBN WHERE cb.status = 'active' LIMIT 10 OFFSET 1;"
        )
        console.log('data')
        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data[0],
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: 'fail',
        error: error,
      })
    }
  }

  public async circulatedBookIndex({ response, request }: HttpContext) {
    const { ISBN } = request.body()
    try {
      const query = await db.rawQuery(
        "SELECT cb.id AS circulated_book_id, b.ISBN, b.title AS book_title, GROUP_CONCAT(a.name SEPARATOR ', ') AS authors, p.name AS publisher, cb.description, cp.path AS image_link, u.username AS uploader_name FROM circulated_books cb JOIN books b ON cb.books_ISBN = b.ISBN JOIN book_authors ba ON b.ISBN = ba.books_ISBN JOIN authors a ON ba.author_ID = a.id JOIN publishers p ON b.publisher_ID = p.id LEFT JOIN circulated_pictures cp ON cb.id = cp.circulated_book_ID JOIN users u ON cb.user_ID = u.id WHERE cb.status = 'active' AND b.ISBN = :isbn GROUP BY cb.id, b.ISBN;",
        {
          isbn: ISBN,
        }
      )
      if (query) {
        const data = query[0]

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data,
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          data: [],
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async activatedCirculatedBook({ params, response, auth }: HttpContext) {
    const { id } = params

    const user = await auth.authenticate()
    try {
      // Cari buku berdasarkan ID
      const circulatedBook = await CirculatedBook.find(id)

      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          message: 'not found',
        })
      }

      if (!user) {
        return response.status(401).json({
          code: 401,
          status: 'unauthorized',
          data: user,
        })
      }

      if (circulatedBook['$extras']['user_ID'] != user.id) {
        return response.status(403).json({
          code: 403,
          status: 'forbidden',
        })
      }

      // Update status menjadi "active"
      circulatedBook.status = 'active'
      await circulatedBook.save()

      return response.status(200).json({
        code: 200,
        message: 'success',
        data: circulatedBook,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async circBook({ auth, response }: HttpContext) {
    const user = await auth.authenticate()

    try {
      const query = await db.rawQuery(
        "SELECT cb.id AS circulated_book_id, b.ISBN, b.title AS book_title, GROUP_CONCAT(DISTINCT a.name SEPARATOR ', ') AS authors, p.name AS publisher, cb.description, cp.path AS image_link, cb.status AS status FROM circulated_books cb JOIN books b ON cb.books_ISBN = b.ISBN JOIN book_authors ba ON b.ISBN = ba.books_ISBN JOIN authors a ON ba.author_ID = a.id JOIN publishers p ON b.publisher_ID = p.id LEFT JOIN circulated_pictures cp ON cb.id = cp.circulated_book_ID JOIN users u ON cb.user_ID = u.id WHERE u.id = :id GROUP BY cb.id, b.ISBN;",
        {
          id: user.id,
        }
      )
      if (query) {
        const data = query[0]

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data,
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          data: [],
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
  public async detailCirculatedBook({ request, response }: HttpContext) {
    const { circulated_ID } = request.body()
    try {
      const query = await db.rawQuery(
        "SELECT cb.id AS circulated_book_id, b.ISBN, b.title AS book_title, GROUP_CONCAT(a.name SEPARATOR ', ') AS authors, p.name AS publisher, cb.description, cp.path AS image_link, u.username AS uploader_name FROM circulated_books cb JOIN books b ON cb.books_ISBN = b.ISBN JOIN book_authors ba ON b.ISBN = ba.books_ISBN JOIN authors a ON ba.author_ID = a.id JOIN publishers p ON b.publisher_ID = p.id LEFT JOIN circulated_pictures cp ON cb.id = cp.circulated_book_ID JOIN users u ON cb.user_ID = u.id WHERE cb.id = :id;",
        {
          id: parseInt(circulated_ID),
        }
      )
      if (query) {
        const data = query[0]

        return response.status(200).json({
          code: 200,
          status: 'success',
          data: data,
        })
      } else {
        return response.status(404).json({
          code: 404,
          status: 'not found',
          data: [],
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }

  public async verifyCircBook({ auth, params, response }: HttpContext) {
    const user = await auth.authenticate()
    try {
      // Pastikan user yang sedang melakukan verifikasi memiliki role sebagai admin
      if (user.role != 'admin') {
        return response.status(404).json({
          code: 404,
          status: 'anda bukan admin',
          data: user,
        })
      }

      // temukan circBook berdasarkan id
      const verifCircBook = await CirculatedBook.find(params.id)

      // cek apakah circBook ada atau tidak
      if (!verifCircBook) {
        return response.status(404).json({
          message: 'Not Found',
        })
      }

      // verified circBook
      verifCircBook.verified = 'verified'
      await verifCircBook.save()

      return response.status(200).json({
        code: 200,
        message: 'success',
        data: verifCircBook,
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message,
      })
    }
  }
}
