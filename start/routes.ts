/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'
import BooksController from '#controllers/books_controller'
import AuthorsController from '#controllers/authors_controller'
import PublishersController from '#controllers/publishers_controller'

router.group(()=> {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])

  router.post('/fetch-book',[BooksController, 'fetchGoogleAPI'])

  router.post('author/store',[AuthorsController, 'store'])
  router.get('author/index',[AuthorsController, 'index'])

  router.post('publisher/store',[PublishersController, 'store'])
  router.get('publisher/index',[PublishersController, 'index'])
}).prefix('/api')
