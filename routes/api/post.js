const express = require('express');
const router = express.Router();
const moongose = require('mongoose');
const passport = require('passport');

//load Post model
const Post = require('../../models/Post')
//load Post Profile
const Profile = require('../../models/Profile')

//Load validation
const validatePostInput = require('../../validation/post')

//@route    GET api/post/test
//@route    Test post route
//@route    Public
router.get('/test', (req, res) => res.json({message: "post works "}))

//@route    GET api/post
//@route    get post 
//@route    Public

router.get('/', (req, res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(errors => 
            res.status(404).json({nopostFount: 'no post was found with that id', errors})
            );
});

//@route    GET api/post/:id
//@route    get post 
//@route    Public

router.get('/:id', (req, res) => {
    Post.findById(req.params.id) 
        .then(post => res.json(post))
        .catch(errors => res.status(404).json({nopostFount: 'no post was found with that id', errors}))
})

//@route    POST api/post
//@route    Create post 
//@route    Private

router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const {errors, isValid } = validatePostInput(req.body)

    //check validation
    if(!isValid){
        //if any errors send 400 w/ errors object
        return res.status(400).json(errors)
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    })

    newPost.save().then(post => res.json(post))

})

//@route    DELETE api/post/:id
//@route    delete post 
//@route    Private

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Profile.findOne({user: req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if(post.user.toString() !== req.user.id){
                        res.status(401).json({user: 'user not authorize'})
                    }

                //delete the post
                post.remove().then(() => res.json({success: true}))    
                })
                .catch(errors => res.status(404).json({postnotfound: 'Post was not found'}, error))
        })
})



module.exports= router;