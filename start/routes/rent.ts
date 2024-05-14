import router from '@adonisjs/core/services/router'
import RentsController from '#controllers/rents_controller'

router.group(() => {
  router.get('/renter-status/:type',[RentsController, 'renterStatus'])
  router.post('/borrow',[RentsController, 'borrow'])
  router.post('/confirm',[RentsController, 'confirmBorrow'])
  router.post('/return',[RentsController, 'confirmReturn'])
}).prefix('/api/rent')
