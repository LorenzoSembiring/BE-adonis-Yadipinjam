import router from '@adonisjs/core/services/router'
import UsersController from '#controllers/users_controller'

router.group(() => {
  router.post('/register', [UsersController, 'register'])
  router.post('/login', [UsersController, 'login'])
  router.get('/user', [UsersController, 'getUser'])
  router.get('/index', [UsersController, 'indexUser'])
  router.get('/user/book/:id', [UsersController, 'userBook'])
  router.put('/admin/update', [UsersController, 'updateAdmin'])
  router.delete('/logout', [UsersController, 'logout'])
  router.delete('/delete/:id', [UsersController, 'deleteUser'])
}).prefix('/api/auth')
