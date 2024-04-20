import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'circulated_books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('description')
      table.integer('price')
      table.string('status')
      table.string('books_ISBN').references('books.ISBN').notNullable()
      table.integer('user_ID').references('users.id').notNullable().unsigned()
      table.dateTime('created_at')
      table.dateTime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
