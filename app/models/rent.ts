import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Rent extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userID: number

  @column()
  declare Circulated_BookID: number

  @column()
  declare status: string

  @column()
  declare notes: string

  @column()
  declare start_date: Date

  @column()
  declare end_date: Date

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
