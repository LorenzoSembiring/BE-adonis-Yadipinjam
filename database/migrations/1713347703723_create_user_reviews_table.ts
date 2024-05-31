import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_reviews'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary().notNullable()
      table.integer('star').nullable()
      table.string('feedback').nullable()
      table.integer('to').references('users.id').notNullable().unsigned().onDelete('CASCADE')
      table.integer('from').references('users.id').notNullable().unsigned().onDelete('CASCADE')
      table.enum('type', ['to renter', 'to owner']).notNullable()
      table.dateTime('created_at')
      table.dateTime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
