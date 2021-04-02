const express = require('express')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportRouter = express.Router()
const sequelize = require('../db_models/models/index').sequelize
const User = sequelize.import('../db_models/models/user')


passportRouter.use(passport.initialize())
passportRouter.use(passport.session())

passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (email, password, done) {
        User.findOne({ where: { email: email } }).then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' })
            }
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, user, { message: 'Welcome.' })
        }).catch(error => {
            console.log(error)
            return done(error)
        }
        )
    }))

passport.serializeUser(function (user, done) {
    done(null, user.id);
})

passport.deserializeUser(function (id, done) {
    User.findByPk(id).then(user => {
        done(null, user)
    }).catch(error => {
        done(error)
    })
})


passportRouter.post('/login', passport.authenticate('local', {
    failureRedirect: '/html/login.html',
    session: true
}), (req, res) => { res.redirect('/html/home.html') })


passportRouter.post('/api/user/create', passport.authenticate('local', {
    failureRedirect: '/html/registration.html',
    session: true
}), (req, res) => { res.redirect('/html/home.html') })
// , (req, res) => { res.redirect('/api/user/' + req.user.id) })

passportRouter.get('/logout', (req, res) => {
    req.logout()
    console.log(req.user)
    res.redirect('/login')
    res.end()
})


module.exports = passportRouter