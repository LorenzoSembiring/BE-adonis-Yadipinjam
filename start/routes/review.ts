import router from '@adonisjs/core/services/router'
import ReviewsController from '#controllers/reviews_controller'

router.group(() => {
  router.post('owner',[ReviewsController, 'reviewOwner'])
  router.post('renter',[ReviewsController, 'reviewRenter'])
  router.get('get/:id',[ReviewsController, 'getReview'])
  router.get('get/owner/:id',[ReviewsController, 'getOwnerReview'])
  router.get('get/renter/:id',[ReviewsController, 'getRenterReview'])
}).prefix('/api/review')
