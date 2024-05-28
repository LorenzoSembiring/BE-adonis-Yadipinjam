import router from '@adonisjs/core/services/router'
import ReviewsController from '#controllers/reviews_controller'

router.group(() => {
  // uncomment route bellow when the feature is done
  // router.post('owner',[ReviewsController, 'reviewOwner'])
  // router.post('renter',[ReviewsController, 'reviewRenter'])
  router.post('/peminjam', [ReviewsController, 'reviewPemilik'])
}).prefix('/api/review')
