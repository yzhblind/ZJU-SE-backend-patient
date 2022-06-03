const router = require('express').Router();
const { query } = require('express');
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

const {validQuery } = require('../../tools/order');
const { default: mongoose } = require('mongoose');


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
                    gender: user.gender,
                    hereditary : user.hereditary,
                    pastill : user.pastill,
                    height : user.height,
                    weight : user.weight
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
            let body={}


            body['gender'] = req.body.params.gender
            body['age'] = req.body.params.age

            if (validQuery(req.body.params.hereditary)) {
                body['hereditary'] = req.body.params.hereditary
            }

            if (validQuery(req.body.params.pastill)) {
                body['pastill'] = req.body.params.pastill
            }

            if (validQuery(req.body.params.height)) {
                body['height'] = req.body.params.height
            }

            if (validQuery(req.body.params.weight)) {
                body['weight'] = req.body.params.weight
            }

            patient.updateOne({ _id: req.body.params.user_id }, {
                $set: body
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
        if (req.user.id == req.body.params.user_id) {
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