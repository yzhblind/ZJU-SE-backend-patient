var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose')
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../models');
var keys = require('./keys')

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.public_key;
opts.algorithms = ['RS256']

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // jwt_payload 中含有用户的ID信息
        patient.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    // 将用户信息写入到req.user
                    return done(null, user)
                }
                return done(null, false)
            }).catch(err => { console.log(err) })
    }))
}
