import router from '@adonisjs/core/services/router'
import RentsController from '#controllers/rents_controller'

router.group(() => {
  router.get('/renter-status/:type?',[RentsController, 'renterStatus'])
  router.post('/borrow',[RentsController, 'borrow'])
  router.post('/return',[RentsController, 'returnBook'])
  router.get('/confirmOwner',[RentsController, 'confirmOwner'])
  router.post('/confirmBorrow',[RentsController, 'confirmBorrow'])
  router.post('/confirmReturn',[RentsController, 'confirmReturn'])
}).prefix('/api/rent')
