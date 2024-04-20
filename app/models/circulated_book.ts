import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CirculatedBook extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare status: string

  @column()
  declare BooksISBN: string

  @column()
  declare user_ID: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
