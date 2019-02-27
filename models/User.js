const moongoose = require('mongoose');
const Schema = moongoose.Schema;
const bcrypt = require('bcryptjs')

//Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true, 
    },
    password: {
        type: String,
        required: true, 
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = moongoose.model('users', UserSchema)