const express = require ('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport')



const post = require('./routes/api/post')
const profile = require('./routes/api/profile')
const users = require('./routes/api/users')

const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const db = require('./config/key')

//passport middleware
app.use(passport.initialize())

//passport Config
require('./config/passport')(passport);

//routes
app.use('/api/post', post)
app.use('/api/profile', profile)
app.use('/api/users', users)

//Connect to Heroku/5000
const port = process.env.PORT ||  5000;

app.listen(port, () => console.log(`listening on port ${port}`) )