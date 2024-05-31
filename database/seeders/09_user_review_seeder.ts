import UserReview from '#models/user_review'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    UserReview.createMany([
      {
        star: 4,
        feedback: "Owner Mantap, aman",
        to: 2,
        from: 1,
        type: types.owner
      },
      {
        star: 4,
        feedback: "Mantap",
        to: 1,
        from: 2,
        type: types.renter
      },
    ])
  }
}
enum types {
  renter = 'to renter',
  owner = 'to owner',
}
