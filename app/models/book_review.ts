import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class BookReview extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare star: number

  @column()
  declare feedback: string

  @column()
  declare circulated_id: number

  @column()
  declare from: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

enum types{
  renter = "to renter",
  owner = "to owner"
}
