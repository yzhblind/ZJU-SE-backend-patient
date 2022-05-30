var router = require('express').Router();
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

router.get('/query', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log('order query request incomes.');

});

router.post('/delete', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    console.log('order delete request incomes.');

});

router.get('/info', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('order info request incomes.');
    try {
        const ord = await order.findById(req.query.order_id).exec()
        if (ord == null) {
            return res.json({
                status: 'fail',
                err: {
                    errcode: 107,
                    msg: '订单不存在'
                }
            })
        }
        if (req.user.id == ord.user_id) {
            const user = await patient.findById(req.user.id).exec()
            const doc = await doctor.findById(ord.doctor_id).exec()
            res.json({
                status: 'success',
                data: {
                    order_id: ord._id,
                    user_id: ord.user_id,
                    doctor_id: ord.doctor_id,
                    user_name: user.name,
                    doctor_name: doc.name,
                    time: ord.time,
                    status: ord.status,
                    comments: ord.comments
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
    } catch (err) {
        next(err)
    }
});

router.post('/comment', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    console.log('order comment request incomes.');
    try {
        const ord = await order.findById(req.body.order_id).exec()
        if (ord == null) {
            return res.json({
                status: 'fail',
                err: {
                    errcode: 107,
                    msg: '订单不存在'
                }
            })
        }
        if (req.user.id == ord.user_id) {
            order.updateOne({ _id: req.body.order_id }, {
                $push: {
                    comments: {
                        body: req.body.content,
                        date: Date.now()
                    }
                }
            }).then(() => {
                res.json({
                    status: 'success',
                    data: {
                        msg: '评论成功'
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
    } catch (err) {
        next(err)
    }
});

module.exports = router;