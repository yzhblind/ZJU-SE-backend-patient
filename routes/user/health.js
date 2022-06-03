var router = require('express').Router();
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

router.get('/tips', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log('health tips request incomes.');
    if (req.user.id == req.query.user_id) {
        res.json({
            status: 'success',
            data: [
                { total: "11.9", change_rate: 1 },
                { pulse_oximeter: "97.6%", change_rate: 4 },
                { sleep_quality: "11.6", change_rate: -1 },
                { heart_rate: "98.2", change_rate: 1 }
            ]
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