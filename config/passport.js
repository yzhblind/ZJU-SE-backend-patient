const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('./keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // jwt_payload contains the user infomation
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    // here we write the user information into req.user
                    return done(null, user)
                }
                return done(null, false)
            }).catch(err => { console.log(err) })
    }))
}
