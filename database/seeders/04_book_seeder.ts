import Book from '#models/book'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    Book.createMany([
      {
        ISBN: '0316769487',
        publisher_ID: 4,
        year: 1991,
        title: 'The Catcher in the Rye',
        verified: 'verified',
        imagelink: 'http://books.google.com/books/content?id=ZotvleqZomIC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      },
      {
        ISBN: '0451524934',
        publisher_ID: 2,
        year: 2024,
        title: 'Nineteen Eighty-four',
        verified: 'verified',
      },
      {
        ISBN: '0679722769',
        publisher_ID: 1,
        year: 1990,
        title: 'Ulysses',
        verified: 'verified',
        imagelink: 'http://books.google.com/books/content?id=-M81yfXQ2LkC&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      },
      {
        ISBN: '9780446310789',
        publisher_ID: 3,
        year: 1988,
        title: 'To Kill a Mockingbird',
        verified: 'verified',
      },
      {
        ISBN: '9780679764029',
        publisher_ID: 1,
        year: 1995,
        title: 'Snow Falling on Cedars',
        verified: 'verified',
        imagelink: 'http://books.google.com/books/content?id=KIKTEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api',
      },
    ])

  }
}
