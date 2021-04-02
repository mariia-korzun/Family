const express = require('express')
const postRouter = express.Router()
const postController = require('../controllers/post_controller')



postRouter.post('/', postController.createPost)
postRouter.get('/', postController.getPost)


module.exports = postRouter