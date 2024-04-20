import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BookAuthor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare author_ID: number

  @column()
  declare books_ISBN: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
