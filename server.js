const express = require ('express')
const mongoose = require('mongoose');


const post = require('./routes/api/post')
const profile = require('./routes/api/profile')
const users = require('./routes/api/users')

const app = express();

const db = require('./config/key')

app.get('/', (req, res) => res.send('Hello'))

//routes
app.use('/api/post', post)
app.use('/api/profile', profile)
app.use('/api/users', users)

//Connect to Heroku/5000
const port = process.env.PORT ||  5000;

app.listen(port, () => console.log(`listening on port ${port}`) )