import { BaseSeeder } from '@adonisjs/lucid/seeders'
import db from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {

    const today = new Date
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    await db.rawQuery(
      'INSERT INTO rents (userID, Circulated_BookID, status, start_date, end_date) VALUES (:user,:circulated_ID,:status,:start_date,:end_date);',
      {
        user: 1,
        circulated_ID: 3,
        status: 'complete',
        start_date: today,
        end_date: nextWeek
      }
    )
    await db.rawQuery(
      'INSERT INTO rents (userID, Circulated_BookID, status, start_date, end_date) VALUES (:user,:circulated_ID,:status,:start_date,:end_date);',
      {
        user: 1,
        circulated_ID: 1,
        status: 'pending',
        start_date: today,
        end_date: nextWeek
      }
    )
  }
}
