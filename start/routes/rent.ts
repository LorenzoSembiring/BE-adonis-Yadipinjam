import router from '@adonisjs/core/services/router'
import RentsController from '#controllers/rents_controller'

router.group(() => {
  router.post('/borrow',[RentsController, 'borrow'])
  router.post('/confirm',[RentsController, 'confirmBorrow'])
  router.post('/return',[RentsController, 'confirmReturn'])
}).prefix('/api/rent')
