import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios';
import BookAuthor from '#models/book_author'

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
        book_ISBN: ISBN
      })
      return data
    } catch (error) {
      return null
    }
  }

}
