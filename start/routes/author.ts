import router from '@adonisjs/core/services/router'
import AuthorsController from '#controllers/authors_controller'

router.group(() => {
  router.post('store',[AuthorsController, 'store'])
  router.get('/',[AuthorsController, 'index'])
}).prefix('/api/author')
