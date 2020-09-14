const sequilize = require('../db_models/models/index').sequelize
const User = sequilize.import('../db_models/models/user')

this.createUser = function (req, res) {
    User.create({
        firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email,
        password: req.body.password, dataOfBirth: req.body.dataOfBirth
    }).then(user => {
        res.status(201).end()
    }).catch(error => {
        res.status(400).send(error)
    })
}
this.getUser = function (req, res) {
    User.scope('withoutEmailAndPassword').findByPk(req.params.id).then(user => {
        console.log(user)
        res.status(200).send(user)
    }).catch(error => {
        res.status(505).send(error)
    })
}
this.updateUser = function (req, res) {
    User.update({ firstName: req.body.firstName, lastName: req.body.lastName, dataOfBirth: req.body.dataOfBirth }, { where: { id: req.params.id } }).then(array => {
        res.status(200).send('updated')
    }).catch(error => {
        res.status(404).end()
    })
}
this.checkAuthorization = function (req, res, next) {
if (!req.user){res.status(401).end()}
else{next()}
}