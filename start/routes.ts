/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import "./routes/user.ts"
import "./routes/publisher.ts"
import "./routes/book.ts"
import "./routes/author.ts"

router.get('/', async () => {
  return { status: 'connected!' }
})
