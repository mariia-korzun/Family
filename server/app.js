const express = require('express')
const app = express()
const port = 3000
const userRouter = require('./routers/user_router')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const maxAgeSession = 2 * 24 * 60 * 60
const passportRouter = require('./routers/passport_router')
const checkAuthorizationRouter = require('./routers/check_authorization_router')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'))

//app.use(express.json(), passportRouter )
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: maxAgeSession * 1000 },
    store: new fileStore({ ttl: maxAgeSession })
}))

app.use(express.json())
app.post('/login', urlencodedParser)
app.use(passportRouter, checkAuthorizationRouter)
app.use('/api/user', userRouter)
app.use('/api/asset', )

app.listen(port, () => console.log(`App listening on port ${port}!`))




// {
// 	"firstName" : "Vladyslav",
// 	"lastName" : "Korzun",
// 	"email": "korzun.v.a@gmail.com",
//   "password": "00000000",
//   "dataOfBirth" : "1993-03-14"
// }



