import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import Publisher from '#models/publisher'

export default class PublishersController {
  public async store({ request, response }: HttpContext) {
    const { name } = request.body()
    const trx = await db.transaction()

    try {
      const author = await Publisher.create({
        name: name
      })

      await trx.commit()
      return response.status(200).json({
        code: 200,
        message: "success",
        data: author
      })
    } catch (error) {
      await trx.rollback()

      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error
      })
    }
  }

  public async create(name: string):Promise<number|null> {
    try {
      const data: Publisher = await Publisher.create({
        name: name
      })

      return data.id
    } catch (error) {
      return null
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const data = await Publisher.all()

      return response.status(200).json({
        code: 200,
        message: "success",
        data: data
      })
    } catch (error) {
      return response.status(500).json({
        code: 500,
        message: "fail",
        error: error
      })
    }
  }
}
