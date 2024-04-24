import router from '@adonisjs/core/services/router'
import BooksController from '#controllers/books_controller'

router
  .group(() => {
    router.post('/fetch-book', [BooksController, 'fetchGoogleAPI'])
    router.post('/book/upload', [BooksController, 'uploadBook'])
    router.post('/book/circulated', [BooksController, 'circulatedBookIndex'])
    router.post('/book/circulated/detail', [BooksController, 'detailCirculatedBook'])
    router.get('/book', [BooksController, 'bookIndex'])
    router.get('/book/circulated/activated/:id', [BooksController, 'activatedCirculatedBook'])
    router.get('/book/circulatedBook', [BooksController, 'circBook'])
  })
  .prefix('/api')
