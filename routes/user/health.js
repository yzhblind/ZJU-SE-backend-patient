var router = require('express').Router();
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

// deprecated
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

router.get('/gethealthinfo', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('health info get request incomes.');
    if (req.user.id == req.query.user_id) {
        const user = await patient.findById(req.user.id).exec()
        res.json({
            status: 'success',
            data: {
                health: user.health
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

router.post('/sethealthinfo', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('health info set request incomes.');
    if (req.user.id == req.body.params.user_id) {
        const user = await patient.findById(req.user.id).exec()
        const old_health = user.health
        let new_health = {}
        new_health['total'] = {
            value: req.body.params.general,
            rate: req.body.params.general-old_health.total.value
        }
        new_health['pulse_oximeter'] = {
            value: req.body.params.bloodoxygen,
            rate: req.body.params.bloodoxygen-old_health.pulse_oximeter.value
        }
        new_health['sleep_quality'] = {
            value: req.body.params.sleep,
            rate: req.body.params.sleep-old_health.sleep_quality.value
        }
        new_health['heart_rate'] = {
            value: req.body.params.heartrate,
            rate: req.body.params.heartrate-old_health.heart_rate.value
        }
        // console.log(new_health)
        patient.updateOne({ _id: req.user.id }, {
            $set: { health:new_health }
        }).then(() => {
            res.json({
                status: 'success',
                data: {
                    msg: '设置成功'
                }
            })
        }).catch(next)
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