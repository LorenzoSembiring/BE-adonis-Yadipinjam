import Author from '#models/author'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Author.createMany([
      {
        name: "David Guterson"
      },
      {
        name: "George Orwell"
      },
      {
        name: "James Joyce"
      },
      {
        name: "Harper Lee"
      },
      {
        name: "J.D. Salinger"
      },
    ])
    }
}
