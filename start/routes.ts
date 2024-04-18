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
import AuthorsController from '#controllers/authors_controller'

router.post('/register', [UsersController, 'register'])
router.post('/login', [UsersController, 'login'])

router.post('/fetch-book',[BooksController, 'fetchGoogleAPI'])

router.post('author/store',[AuthorsController, 'store'])
router.get('author/index',[AuthorsController, 'index'])
