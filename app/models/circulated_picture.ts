import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class CirculatedPicture extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare circulated_book_ID	: number

  @column()
  declare path	: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
