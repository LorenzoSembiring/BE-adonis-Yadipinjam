import BookReview from '#models/book_review'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    BookReview.createMany([
      {
        star: 4,
        feedback: "bagus",
        circulated_id: 3,
        from: 1
      },
      {
        star: 5,
        feedback: "great experience!",
        circulated_id: 1,
        from: 1
      },
    ])
  }
}
