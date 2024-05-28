import router from '@adonisjs/core/services/router'
import ReviewsController from '#controllers/reviews_controller'

router.group(() => {
  // uncomment route bellow when the feature is done
  router.post('owner',[ReviewsController, 'reviewOwner'])
  router.post('renter',[ReviewsController, 'reviewRenter'])
}).prefix('/api/review')
