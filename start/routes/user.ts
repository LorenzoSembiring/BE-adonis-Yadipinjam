import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
  router.get('/user', [UsersController, 'getUser'])
  router.get('/index', [UsersController, 'indexUser'])
  router.get('/user/book/:id', [UsersController, 'userBook'])
  router.put('/admin/update', [UsersController, 'updateAdmin'])
  router.put('/password-update', [UsersController, 'updatePassword'])
  router.delete('/logout', [UsersController, 'logout'])
  router.delete('/delete/:id', [UsersController, 'deleteUser'])
  router.put('/users/update', [UsersController, 'updateUser'])
}).prefix('/api/auth')
