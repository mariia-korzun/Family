const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user_controller')


userRouter.get('/', userController.getUser)
userRouter.post('/update/:id', userController.updateUser)
userRouter.post('/follow', userController.follow)
userRouter.get('/followers', userController.getFollowers)
userRouter.post('/searchUser', userController.findNameMatches)

module.exports = userRouter