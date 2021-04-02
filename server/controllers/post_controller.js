const sequilize = require('../db_models/models/index').sequelize
const Post = sequilize.models.Post
const User = sequilize.models.User
const Asset = sequilize.models.Asset
const Album = sequilize.models.Album
const parametrsAvatarPhotos = [
    {
        model: Album,
        where: {
            type: 'avatar'
        },
        as: "Albums",
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        required: false,
        include: [
            {
                model: Asset,
                as: "Assets",
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                },
                through: {
                    attributes: []
                }
            }
        ]
    }
]


this.createPost = function (req, res) {
    let postObject
    Post.create({
        text: req.body.postText
    }).then(post => {
        postObject = post
        return postObject.addAssets(req.body.fileId)
    }).then(post => {
        return postObject.setOwner(req.user.id)
    }).then(post => {
        return postObject.setRecipient(req.body.recipient)
    }).then(post => {
        res.status(201).end()
    }).catch(error => {
        console.log(error)
        res.status(505).send(error)
    })
}

this.getPost = function (req, res) {
    Post.findAll(
        {
            where: { recipient: req.query.id },
            order: [['id', 'DESC']],
            attributes: { exclude: ['recipient', 'createdAt', 'updatedAt', 'owner'] },
            include: [
                {
                    model: User,
                    as: "Owner",
                    attributes: { exclude: ['email', 'password', 'dataOfBirth', 'createdAt', 'updatedAt'] } 
                },
                {
                    model: Asset,
                    as: "Assets",
                    attributes: { exclude: ['owner', 'mimeType', 'extension', 'createdAt', 'updatedAt'] },
                    through: {
                        attributes: []
                    }
                }
            ]
        }
    ).then(arrayOfPosts => {
       let arrayOfRawPostObjects =  arrayOfPosts.map(el => el.get({ plain: true }))
       arrayOfRawPostObjects.forEach(post => {
            post.Assets.forEach(asset => {
                asset.path = '/api/asset/' + asset.id
            })
        })
        res.status(200).json(arrayOfRawPostObjects)
    }).catch(error => {
        console.log(error)
        res.send(error)
    })
}