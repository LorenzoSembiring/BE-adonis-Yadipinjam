import router from '@adonisjs/core/services/router'
import BooksController from '#controllers/books_controller'

router.group(() => {
  router.post('/fetch-book',[BooksController, 'fetchGoogleAPI'])
  router.post('/book/upload',[BooksController, 'uploadBook'])
  router.get('/book', [BooksController, 'bookIndex'])
  router.get('/book/circulated', [BooksController, 'circulatedBookIndex'])
  router.get('/book/circulated/activated/:id', [BooksController, 'activatedCirculatedBook'])
}).prefix('/api')
