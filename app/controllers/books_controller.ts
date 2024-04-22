import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios';
import db from '@adonisjs/lucid/services/db'
import Book from '#models/book'
import BookAuthor from '#models/book_author'
import Publisher from '#models/publisher';
import Author from '#models/author'
import CirculatedBook from '#models/circulated_book'
import PublishersController from '#controllers/publishers_controller';
import AuthorsController from './authors_controller.js';

export default class BooksController {

  public async fetchGoogleAPI({ request, response }: HttpContext){
    const {ISBN} = request.body()
    const url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN
    try {
      const res = await axios.get(url);

      if(res.data.totalItems > 0) {
        const title: string = res.data.items[0].volumeInfo.title
        const authors: Array<string> = res.data.items[0].volumeInfo.authors
        const publisher: string = res.data.items[0].volumeInfo.publisher
        const publishedDate: string = res.data.items[0].volumeInfo.publishedDate

        const data = {
          title: title,
          authors: authors,
          publisher: publisher,
          date: publishedDate
        }

        return response.status(200).json({
          code: 200,
          message: "success",
          data: data
        })
      } else {
        return response.status(200).json({
          code: 200,
          message: "not found"
        })
      }
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message
      })
    }
  }

  public async createBookAuthor(ISBN: string, author_ID: number){
    try {
      const data = await BookAuthor.create({
        author_ID: author_ID,
        books_ISBN: ISBN
      })
      return data
    } catch (error) {
      return null
    }
  }

  public async getBookByISBN(ISBN: string){
    try {
      const data = await Book.findByOrFail('ISBN',ISBN)
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
  public async createBook(ISBN: string, authors: string[], publisher: string, year: number, title: string) {
    const publishersController = new PublishersController()
    const authorsController = new AuthorsController()
    // const { ISBN, authors, publisher, year, title} = request.body()
    const trx = await db.transaction()

    const bookData = await Book.findBy("ISBN", ISBN)
    try{
      // retrieve publisher data based on name, create if not exist
      const publisherData = await Publisher.findBy('name', publisher);

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
          year: year
        })
      } else {
        return "Book existed"
      }

      // retrieve author data based on name, create if not exist
      // create bookAuthor after author exist
      for (let index = 0; index < authors.length; index++) {
        const authorData = await Author.findBy('name', authors[index]);
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
  public async uploadBook({ request, response, auth }: HttpContext) {

    const trx = await db.transaction()

    const { ISBN, authors, publisher, year, title, description, price } = request.body()

    const authorArray: string[] = authors.split("?")

    const bookCheck = this.getBookByISBN(ISBN)
    const user = await auth.authenticate()

    try {
      // if the book is exist, just create the circulated_book
      // if not, create book first
      if (!await bookCheck) {
        await this.createBook(ISBN, authorArray, publisher, year, title)
      }
      const data = await CirculatedBook.create({
        description: description,
        price: price,
        status: "inactive",
        books_ISBN: ISBN,
        user_ID: user.id
      })

      await trx.commit()
      return response.status(200).json({
        code: 200,
        status: "success",
        data: data
      })
    } catch (error) {
      await trx.rollback()
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error
      })
    }
  }
  public async bookIndex({ request, response}: HttpContext) {
    try {
      const page = request.qs()
      const data = await db.from('books').paginate(page.page, page.limit)
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

  public async circulatedBookIndex({ request, response}: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const data = await db.from('circulated_books').paginate(page, limit)
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
  public async activatedCirculatedBook({ params, response, auth }: HttpContext) {
    const { id } = params

    const user = await auth.authenticate()
    try {
      // Cari buku berdasarkan ID
      const circulatedBook = await CirculatedBook.find(id)

      if (!circulatedBook) {
        return response.status(404).json({
          code: 404,
          message: 'not found'
        })
      }

      if (!user) {
        return response.status(401).json({
          code: 401,
          status: "unauthorized",
          data: user
        })
      }

      if (circulatedBook['$extras']['user_ID'] != user.id) {
        return response.status(403).json({
          code: 403,
          status: "forbidden",
        })
      }

      // Update status menjadi "active"
      circulatedBook.status = 'active'
      await circulatedBook.save()

      return response.status(200).json({
        code: 200,
        message: 'success',
        data: circulatedBook
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        error: error.message
      })
    }
  }
}
