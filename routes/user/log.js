var router = require('express').Router();
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    console.log('log request incomes.');
    if (req.user.id == req.query.user_id) {
        res.json({
            status: 'success',
            data: {
                logs: 'log这个东西没有存在的意义'
            }
        })
    } else {
        res.status(401).json({
            status: 'fail',
            err: {
                errcode: 106,
                msg: 'token与请求用户不匹配'
            }
        })
    }
});

module.exports = router;