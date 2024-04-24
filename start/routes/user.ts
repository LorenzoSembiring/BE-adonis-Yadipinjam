import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
  router.get('/user', [UsersController, 'getUser'])
  router.delete('/logout', [UsersController, 'logout'])
}).prefix('/api/auth')
