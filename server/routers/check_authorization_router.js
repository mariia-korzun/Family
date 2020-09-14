const express = require('express')
const checkAuthorizationRouter = express.Router()


checkAuthorizationRouter.use('/', (req, res, next) => {
    if (!req.user) {
        res.redirect('/html/login.html')
    }
    else { next() }
}
)

module.exports = checkAuthorizationRouter