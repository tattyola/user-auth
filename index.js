const express = require('express')
const passport = require("passport");
const app = express()
const port = 3000
const session = require("express-session");
const FileStore = require("session-file-store")(session);

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
}));
require('./passportConfig');
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/login', (req, res, next) => {

    // strategy Passport, recieve user
    passport.authenticate('local', function (err, user) {
        if (err) {
            return next(err)
        }

        // if user is not found
        if (!user) {
            return res.send('Enter correct email and password')
        }

        // if auth success - save user session - redirect to admin
        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            return res.redirect('/admin')
        })

    })
    (req, res, next)

})

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        return res.redirect('/')
    }
}

app.get('/admin', auth, (req, res) => {
    res.send('Admin')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
