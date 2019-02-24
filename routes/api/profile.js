const express = require('express');
const router = express.Router();
const moongoose = require('mongoose');
const passport = require('passport');

//load Validation
const validateProfileInput = require('../../validation/profile')
const validateExperienceInput = require('../../validation/experience')
const validateEducationInput = require('../../validation/education')

//load profile
const Profile = require('../../models/Profile')
//load User
const User = require('../../models/User')

//@route    GET api/profile/test
//@route    Test profile route
//@route    Public
router.get('/test', (req, res) => res.json({
    message: "profile works "
}))

//@route    GET api/profile
//@route    Current user profile route
//@route    Private 
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {}
    Profile.findOne({
            user: req.user.id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user'
                return res.status(404).json(errors)
            }
            res.json(profile);
        })
        .catch(error => res.status(404).json(error))
})

//@route    GET api/profile/handle/:handle
//@route    Get profile route by handle
//@route    Public 

router.get('/handle/:handle', (req, res) => {

    const errors = {}

    Profile.findOne({
            handle: req.params.handle
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.status(200).json(profile)
        })
        .catch(error => res.status(404).json({
            profile: 'There is no profile'
        }))
})

//@route    GET api/profile/user/:user_id
//@route    Get profile route by user id
//@route    Public 

router.get('/user/:user_id', (req, res) => {

    const errors = {}

    Profile.findOne({
            user: req.params.user_id
        })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if (!profile) {
                errors.noprofile = 'There is no profile for this user';
                res.status(404).json(errors);
            }

            res.status(200).json(profile)
        })
        .catch(error => res.status(404).json({
            profile: 'There is no profile'
        }))
})

//@route    GET api/profile/all
//@route    Get profile route by user id
//@route    Public 

router.get('/all', (req, res) => {

    const errors = {}

    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofiles = 'There are no profiles';
                res.status(404).json(errors);
            }

            res.status(200).json(profiles)
        })
        .catch(error => res.status(404).json({
            profiles: 'There are no profiles'
        }))
})

//@route    POST api/profile
//@route    Create/edit user profile route
//@route    Private 
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {

    const {
        errors,
        isValid
    } = validateProfileInput(req.body)

    //check validation
    if (!isValid) {
        //return errors
        return res.status(400).json(errors)
    }

    //Get field
    const profileFields = {}
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle
    if (req.body.company) profileFields.company = req.body.company
    if (req.body.website) profileFields.website = req.body.website
    if (req.body.location) profileFields.location = req.body.location
    if (req.body.status) profileFields.status = req.body.status
    //Skills split to array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }
    if (req.body.bio) profileFields.bio = req.body.bio
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername


    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            if (profile) {
                //update profile
                Profile.updateOne({
                        user: req.user.id
                    }, {
                        $set: profileFields
                    }, {
                        new: true
                    })
                    .then(profile => res.json(profile))
            } else {
                //Create

                //Check if handle exist
                Profile.findOne({
                    handle: profileFields.handle
                }).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists'
                        res.status(404).json(errors)
                    }

                    //save profile
                    new Profile(profileFields).save().then(profile => {
                        res.json(profile)
                    })
                })

            }
        })

})

//@route    POST api/profile/experience
//@route    Add Experience to profile
//@route    Private 

router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body)

    //check validation
    if (!isValid) {
        //return errors
        return res.status(400).json(errors)
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const newexp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            //add to experience array
            profile.experience.unshift(newexp)

            profile.save().then(profile => res.json(profile))
        })
})

//@route    POST api/profile/education
//@route    Add Education to profile
//@route    Private 

router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body)

    //check validation
    if (!isValid) {
        //return errors
        return res.status(400).json(errors)
    }

    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            const education = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            //add to experience array
            profile.education.unshift(education)

            profile.save().then(profile => res.json(profile))
        })
})

//@route    DELETE api/profile/experience/:exp_id
//@route    DELETE experience from profile
//@route    Private 

router.delete('/experience/:exp_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {


    Profile.findOne({
            user: req.user.id
        })
        .then(profile => {
            //GET remove index
            const removeIndex = profile.experience
                .map(item => item.id)
                .indexOf(req.params.exp_id)

            //Splice out of arrays
            profile.experience.splice(removeIndex, 1)

            //save updates
            profile.save().then(profile => res.json(profile))
        })
        .catch(error => {
            console.log(error);
            res.status(404).json({
                error: 'error with deleting experience'
            })
        })
})

module.exports = router;