import router from '@adonisjs/core/services/router'
import BooksController from '#controllers/books_controller'

router.group(() => {
  router.post('/fetch-book',[BooksController, 'fetchGoogleAPI'])

}).prefix('/api')
