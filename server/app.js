const express = require('express')
const app = express()
const port = 3000
const userRouter = require('./routers/user_router')
const assetRouter = require('./routers/asset_router')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const fs = require('fs')
const maxAgeSession = 2 * 24 * 60 * 60
const passportRouter = require('./routers/passport_router')
const checkAuthorizationRouter = require('./routers/check_authorization_router')
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const rawParser = bodyParser.raw({limit:'10mb', type:'image/png'})





if (fs.existsSync('./user_assets')) { }
else {
    fs.mkdir('./server/user_assets', (err) => {
        if (err) {console.log(err)};
    })
}




app.use(express.static('public'))

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
app.use('/api/asset', rawParser, assetRouter)

app.listen(port, () => console.log(`App listening on port ${port}!`))




// {
// 	"firstName" : "Vladyslav",
// 	"lastName" : "Korzun",
// 	"email": "korzun.v.a@gmail.com",
//   "password": "00000000",
//   "dataOfBirth" : "1993-03-14"
// }

