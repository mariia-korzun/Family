const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/user_controller')


userRouter.post('/create',userController.createUser)
userRouter.get('/:id', userController.checkAuthorization, userController.getUser)
userRouter.post('/update/:id', userController.checkAuthorization, userController.updateUser)
module.exports = userRouter