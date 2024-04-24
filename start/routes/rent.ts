import router from '@adonisjs/core/services/router'
import RentsController from '#controllers/rents_controller'

router.group(() => {
  router.post('/borrow',[RentsController, 'borrow'])
}).prefix('/api/rent')
