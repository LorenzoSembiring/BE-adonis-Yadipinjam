import BookAuthor from '#models/book_author'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    BookAuthor.createMany([
      {
        author_ID: 1,
        books_ISBN: "9780679764029"
      },
      {
        author_ID: 2,
        books_ISBN: "0451524934"
      },
      {
        author_ID: 3,
        books_ISBN: "0679722769"
      },
      {
        author_ID: 4,
        books_ISBN: "9780446310789"
      },
      {
        author_ID: 5,
        books_ISBN: "0316769487"
      },

    ])
  }
}
