import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rents'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('userID').references('users.id').notNullable().unsigned().onDelete('CASCADE')
      table.integer('Circulated_BookID').references('circulated_books.id').notNullable().unsigned().onDelete('CASCADE')
      table.enum('status', ['pending', 'confirmed', 'rejected', 'rented', 'overdue', 'returned', 'checking', 'complete'])
      table.date('start_date')
      table.date('end_date')
      table.dateTime('created_at')
      table.dateTime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
