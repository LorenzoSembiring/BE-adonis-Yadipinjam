import CirculatedPicture from '#models/circulated_picture'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    CirculatedPicture.createMany([
      {
        circulated_book_ID: 1,
        path: "Ke Sarang Penyelundup.jpg"
      },
      {
        circulated_book_ID: 2,
        path: "Ke Sarang Penyelundup.jpg"
      },
      {
        circulated_book_ID: 3,
        path: "Terowongan Hantu.jpg"
      },
      {
        circulated_book_ID: 4,
        path: "Pasukan Mau Tahu.jpg"
      },
      {
        circulated_book_ID: 5,
        path: "Enyd Blyton Mystery of The hidden House.jpg"
      },
    ])
  }
}
