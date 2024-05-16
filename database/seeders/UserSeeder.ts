import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from "@adonisjs/lucid/seeders"


export default class UserSeeder extends BaseSeeder {
  public async run () {
    const password = await hash.make('password')

    await User.createMany([
      {
        username: 'andi',
        email: 'andi@andi.com',
        password: password,
        phone: 6281234567890,
        balance: 1000,
        trust_point: 100,
        status: 'active',
        role: role.user
      },
      {
        username: 'budi',
        email: 'budi@budi.com',
        password: password,
        phone: 6281234567891,
        balance: 1000,
        trust_point: 100,
        status: 'active',
        role: role.user
      },
      {
        username: 'udin',
        email: 'udin@udin.com',
        password: password,
        phone: 6281234567892,
        balance: 1000,
        trust_point: 100,
        status: 'active',
        role: role.user
      },
      {
        username: 'dedi',
        email: 'dedi@dedi.com',
        password: password,
        phone: 6281234567893,
        balance: 1000,
        trust_point: 100,
        status: 'active',
        role: role.user
      },
      {
        username: 'admin',
        email: 'admin@admin.com',
        password: password,
        phone: 6281234567894,
        balance: 10,
        trust_point: 100,
        status: 'active',
        role: role.admin
      },
    ])
  }
}
enum role {
    admin = "admin",
    user = "user"
  }