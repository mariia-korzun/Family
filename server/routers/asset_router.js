const express = require('express')
const assetRouter = express.Router()
const assetController = require('../controllers/asset_controller')


assetRouter.post('/', assetController.createAsset)
assetRouter.get('/:assetId', assetController.getAsset)
assetRouter.post('/setavatar',assetController.addAssetToAlbum)


module.exports = assetRouter