const sequilize = require('../db_models/models/index').sequelize
const { Op } = require("sequelize");
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

this.createUser = function (req, res, next) {
    User.create({
        firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email,
        password: req.body.password, dataOfBirth: req.body.birthday
    }).then(user => {
        next()
    }).catch(error => {
        res.status(400).send(error)
    })
}
this.getUser = function (req, res) {
    let userId = parseInt(req.query.id) || req.user.id
    let myPage = (userId === req.user.id) ? true : false
    let resObject = {}
    User.scope('withoutEmailPasswordCreatedUpdated').findByPk(userId,
        {
            include: parametrsAvatarPhotos
        }
    ).then(userOfPage => {
        resObject.myPage = myPage
        resObject.ownerOfPage = userOfPage
        if (myPage) { return null }
        else {
            return userOfPage.hasFollowers(req.user.id)
        }

    }).then(doIFollow => {
        resObject.doIFollowOwnerOfPage = doIFollow

        res.status(200).json(resObject)
    }).catch(error => {
        console.log(error)
        res.status(505).send()
    })

}

this.updateUser = function (req, res) {
    User.update({ firstName: req.body.firstName, lastName: req.body.lastName, dataOfBirth: req.body.dataOfBirth }, { where: { id: req.params.id } })
        .then(array => {
            res.status(200).send('updated')
        }).catch(error => {
            res.status(404).end()
        })
}


this.follow = (req, res) => {
    if (parseInt(req.query.id) === req.user.id) { res.status(403).end(); return }
    // { throw 'oooops' }

    if (req.query.setfollow === 'true') {
        return startFollow(req.user.id, req.query.id, res)
    }
    else if (req.query.setfollow === 'false') {
        return stopFollow(req.user.id, req.query.id, res)
    }
    res.status(400).end()
}

function startFollow(userId, followId, res) {
    User.findByPk(userId).then(user => {
        return user.addFollow(followId)
    }).then(follow => {
        console.log(follow)
        res.status(200).end()
    }).catch(error => {
        console.log(error)
        res.status(400).send(null)
    })
}

function stopFollow(userId, followId, res) {
    User.findByPk(userId).then(user => {
        return user.removeFollow(followId)
    }).then(follow => {
        console.log(follow)
        res.status(200).end()
    }).catch(error => {
        console.log(error)
        res.status(400).send(null)
    })
}


this.getFollowers = (req, res) => {
    let userId = parseInt(req.query.id) || req.user.id
    User.scope('withoutEmailPasswordCreatedUpdated').findByPk(userId,
        {
            include: [
                {
                    model: User,
                    as: "Followers",
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', "email", "password", "dataOfBirth"],
                    },
                    include: parametrsAvatarPhotos,
                    required: false,
                    through: {
                        attributes: []
                    }
                }
            ]
        }
    ).then(follow => {
        res.status(200).json(follow)
    }).catch(error => {
        console.log(error)
        res.status(500).end()
    })
}

this.findNameMatches = (req, res) => {
    let nameArray = req.body.name.split(' ')
    let lastName
    let where
    let name = nameArray[0]
    if (nameArray.length === 1) {
        lastName = name
        where =
        {
            [Op.or]: [{ firstName: { [Op.like]: `%${name}%` } },
            { lastName: { [Op.like]: `%${lastName}%` } }]
        }
    } else {
        lastName = nameArray[1]
        where =
        {
            [Op.and]: [{ firstName: { [Op.like]: `%${name}%` } },
            { lastName: { [Op.like]: `%${lastName}%` } }]
        }
    }
    where[Op.not] = { id: req.user.id }

    User.scope('withoutEmailPasswordCreatedUpdated').findAll({
        where: where,
        include: parametrsAvatarPhotos
    }).then(arrayOfMatches =>
        res.status(200).json(arrayOfMatches)).catch(error => {
            console.log(error)
            res.status(500).end()
        })
}

