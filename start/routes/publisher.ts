import router from '@adonisjs/core/services/router'
import PublishersController from '#controllers/publishers_controller'

router.group(() => {
  router.post('/store',[PublishersController, 'store'])
  router.get('/index',[PublishersController, 'index'])
}).prefix('/api/publisher')
