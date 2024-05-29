import router from '@adonisjs/core/services/router'
import ReviewsController from '#controllers/reviews_controller'

router.group(() => {
  router.post('owner',[ReviewsController, 'reviewOwner'])
  router.post('renter',[ReviewsController, 'reviewRenter'])
  router.post('get/:id',[ReviewsController, 'getReview'])
  router.post('get/owner/:id',[ReviewsController, 'getOwnerReview'])
  router.post('get/renter/:id',[ReviewsController, 'getRenterReview'])
}).prefix('/api/review')
