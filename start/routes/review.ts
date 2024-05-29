import router from '@adonisjs/core/services/router'
import ReviewsController from '#controllers/reviews_controller'

router.group(() => {
  router.post('owner',[ReviewsController, 'reviewOwner'])
  router.post('renter',[ReviewsController, 'reviewRenter'])
  router.post('get/:id',[ReviewsController, 'getReview'])
}).prefix('/api/review')
