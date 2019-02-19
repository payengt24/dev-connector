const express = require('express');
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')

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
    const email = req.body.email;
    const password = req.body.password;

    //find user by email
    User.findOne({
            email
        })
        .then(user => {
            //check for user
            if (!user) {
                return res.status(404).json({
                    email: 'User not found'
                })
            }
            //check pw
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        res.json({
                            msg: 'success'
                        })
                    } else {
                        return res.status(400).json({
                            password: 'Password incorrect'
                        })
                    }
                })
        })
})

module.exports = router;