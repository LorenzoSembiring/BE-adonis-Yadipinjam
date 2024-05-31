import CirculatedBook from '#models/circulated_book'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    CirculatedBook.createMany([
      {
        description: "sangat baik tanpa kurang suatu apapun",
        price: 90000,
        status: 'active',
        books_ISBN: '9780679764029',
        user_ID: 4
      },
      {
        description: "sangat baik",
        price: 80000,
        status: 'active',
        books_ISBN: '0451524934',
        user_ID: 4
      },
      {
        description: "sangat bagus",
        price: 70000,
        status: 'active',
        books_ISBN: '0679722769',
        user_ID: 2
      },
      {
        description: "bagus",
        price: 60000,
        status: 'active',
        books_ISBN: '9780446310789',
        user_ID: 2
      },
      {
        description: "BNIB belum pernah baca",
        price: 50000,
        status: '120000',
        books_ISBN: '0316769487',
        user_ID: 1
      },
    ])
  }
}
