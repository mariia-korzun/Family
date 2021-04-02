const express = require('express')
const unauthorizationUserRouter = express.Router()
const userController = require('../controllers/user_controller')


unauthorizationUserRouter.post('/create', userController.createUser)


module.exports = unauthorizationUserRouter