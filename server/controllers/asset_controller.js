const sequilize = require('../db_models/models/index.js').sequelize
const Asset = sequilize.models.Asset
const User = sequilize.models.User
const Album = sequilize.models.Album
const fs = require('fs')
const mime = require('mime-types')


this.createAsset = (req, res) => {
    let directoryPath = `./server/user_assets/${req.user.id}`
    let extension = mime.extension(req.get('content-type'))
    fs.mkdir(directoryPath, (err) => {
        if (err) { console.log(err) }
        Asset.create({
            owner: req.user.id,
            mimeType: req.get('content-type'),
            extension: extension
        }).then(asset => {
            let fileName = `${asset.id}.${extension}`
            fs.appendFile(`${directoryPath}/${fileName}`, req.body, (err) => {
                if (err) {
                    console.log('Fail')
                }
                else {
                    console.log('file was appended')
                    res.status(201).json({ id: asset.id, path: `/api/asset/${asset.id}` })
                }
            })
        }).catch(error => {
            console.log(error)
            res.send(error)
        })
    })
}


this.getAsset = (req, res) => {
    let assetId = req.path.slice(1)
    Asset.findByPk(assetId).then(asset => {
        res.sendFile(`/${asset.owner}/${asset.id}.${asset.extension}`, { root: './server/user_assets' })
    }).catch(error => {
        console.log(error)
        res.send(error)
    })
}

this.addAssetToAlbum = (req, res) => {
    if(!req.body.id){throw new Error('there is no id in body')}
    Album.findOrCreate({
        where: { owner: `${req.user.id}`, type: 'avatar', name: 'avatar' },
    }).then(album => {
        return album[0].addAssets(req.body.id)
    }).then(() => {
        res.status(200).end()
    }).catch(error => {
        console.log(error)
        res.send(error.message)
    })
}