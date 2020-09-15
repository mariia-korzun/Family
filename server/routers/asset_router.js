const express = require('express')
const assetRouter = express.Router()
const assetController = require('../controllers/asset_controller')


assetRouter.post('/', assetController.createAsset)


module.exports = assetRouter