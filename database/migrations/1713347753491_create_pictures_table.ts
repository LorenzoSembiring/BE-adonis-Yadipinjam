import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'pictures'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('Books_ISBN').references('books.ISBN')
      table.string('path')
      table.dateTime('created_at')
      table.dateTime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
