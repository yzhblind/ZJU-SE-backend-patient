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

router.post('/setinfo', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('set information request incomes.');
    try {
        if (req.user.id == req.body.params.user_id) {
            const gender = req.body.params.gender
            const age= req.body.params.age

            patient.updateOne({ _id: req.body.user_id }, {
                $set: {
                    "gender":gender,
                    "age":age
                }
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
    } catch(err) {
        next(err)
    }
});

router.post('/setavatar', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('set information request incomes.');
    try {
        if (req.user.id == req.body.user_id) {
            const pic_id = req.body.params.pic_id
            patient.updateOne({ _id: req.body.params.user_id }, {
                $set: {
                    "pic_id":pic_id
                }
            },
            ).then(() => {
                res.json({
                    status: 'success',
                    data: {
                        msg: '头像设置成功'
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
    } catch(err) {
        next(err)
    }
});

router.get('/getavatar', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('get avatar request incomes.');
    try {
        if (req.user.id == req.query.user_id) {
            const user = await patient.findById(req.user.id).exec()
            res.json({
                status: 'success',
                data:{
                    url:'/pic/pic'+user.pic_id+'.jpg'
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