import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
}).prefix('/api')