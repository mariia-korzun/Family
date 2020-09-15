const sequilize = require('../db_models/models/index.js').sequelize
const Asset = sequilize.import('../db_models/models/asset')
const fs = require('fs')
const mime = require('mime-types')



this.createAsset = (req, res) => {
    let directoryPath = `./server/user_assets/${req.user.id}`
    fs.mkdir(directoryPath, (err) => {
        if (err) { console.log(err) }
        Asset.create({
            owner: req.user.id
        }).then(asset => {
            let fileName = `${asset.id}.${mime.extension(req.get('content-type'))}`
            fs.appendFile(`${directoryPath}/${fileName}`, req.body, (err) => {
                if (err) {
                    console.log('Fail')
                }
                else {
                    console.log('file was appended')
                    res.status(201).json({ id: asset.id, path: `/api/asset/${fileName}` })
                }

            })
        })

    })
}

this.getAsset = 