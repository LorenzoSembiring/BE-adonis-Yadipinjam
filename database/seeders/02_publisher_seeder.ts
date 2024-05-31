import Publisher from '#models/publisher'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    Publisher.createMany([
      {
        name: 'Vintage'
      },
      {
        name: 'Giantar Pustaka'
      },
      {
        name: 'Grand Central Publishing'
      },
      {
        name: 'Little, Brown'
      },
    ])
  }
}
