const express = require('express');
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../../config/key')
const passport = require('passport')

//load input validation
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

//load User models schema
const User = require('../../models/User')


//@route    GET api/users/test
//@route    Test users route
//@route    Public
router.get('/test', (req, res) => res.json({
    message: "user works "
}))

//@route    GET api/users/register
//@route    Register users route
//@route    Public
router.post('/register', (req, res) => {

    const {errors, isValid} = validateRegisterInput(req.body)
 
    if(!isValid){
        return res.status(404).json(errors)
    }

    console.log(req.body);
    return User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    email: 'email already exists'
                })
            } else {
                //grabbing avatar image using the email
                const avatar = gravatar.url(req, req.body.email, {
                    s: '200', //size of avatar image 
                    r: 'pg', //rating
                    d: 'mm' //defaul avatar image
                });

                //Creating new user
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    avatar
                });
                //salting PW
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //after salting pw, hash it
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log('there is an error with posting data', err))
                    })
                })
            }
        })
        .catch(error => {
            console.log('error');
            console.log(error);
            res.json(error);
        })
})

//@route    GET api/users/login
//@route    Login users route/ returning JWT token
//@route    Public
router.post('/login', (req, res) => {

    const {errors, isValid} = validateLoginInput(req.body)

    if(!isValid){
        return res.status(400).json(errors)
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({
            email
        })
        .then(user => {
            //check for user
            if (!user) {
                errors.email= 'User not found'
                return res.status(404).json(errors)
            }
            //check pw
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user match
                        
                        //create JWT payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        //sign token
                        jwt.sign(
                            payload, 
                            keys.secretOrKey, 
                            {expiresIn: 3600}, //key expires in 1 hr 
                             (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                        })
                    } else {
                        errors.password= 'Password incorrect'
                        return res.status(404).json(errors)
                    }
                })
        })
})

//@route    GET api/users/current
//@route    return current user
//@route    Private
router.get('/current', passport.authenticate('jwt', { session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    })
})


module.exports = router;