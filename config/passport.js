const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const moongoose = require('mongoose');
const User = moongoose.model('users');
const keys = require('../config/key');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log('jwt_payload', jwt_payload);
        User.findById(jwt_payload.id)
            .then(user => {
                //if user is found
                if(user){
                    return done(null, user);
                }else{
                    return done(null, false)
                }
            })
            .catch(err => console.log(err))
    }))
}