import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('ISBN').primary()
      table.integer('publisher_ID').references('publishers.id').notNullable().unsigned()
      table.integer('year')
      table.string('title')
      table.string('imagelink')
      table.dateTime('created_at')
      table.dateTime('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
