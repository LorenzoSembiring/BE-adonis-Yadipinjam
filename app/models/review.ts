import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare star: number

  @column()
  declare feedback: string

  @column()
  declare to: number

  @column()
  declare from: number

  @column()
  declare type: types

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

enum types{
  renter = "to renter",
  owner = "to owner"
}
