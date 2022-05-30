const router = require('express').Router();
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

router.get('/', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('get information request incomes.');
    try {
        if (req.user.id == req.query.user_id) {
            const user = await patient.findById(req.user.id).exec()
            res.json({
                status: 'success',
                data:{
                    username:user.name,
                    phone: user.phone,
                    email: user.email,
                    gender: user.gender
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
    } catch(err) {
        next(err)
    }
});


module.exports = router;