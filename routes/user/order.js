var router = require('express').Router();
const { query } = require('express');
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

const { default: mongoose } = require('mongoose');
const { doctorIdFromName } = require('../../tools/order');
router.get('/query', async function(req, res, next) {
    console.log('order query request incomes.');
    try {
        let query = {};
        if (req.query.user_id == null) {
            return res.json({
                status: 'fail',
                err: {
                    errcode: 107,
                    msg: '缺省参数'
                }
            })
        } else {
            query['user_id'] = mongoose.Types.ObjectId(req.query.user_id);
        }

        if (req.query.order_id != null) {
            query['_id'] = mongoose.Types.ObjectId(req.query.order_id);
        }
        if (req.query.status != null) {
            query['status'] = req.query.status;
        };
        if (req.query.start_date != null) {
            let start = new Date(req.query.start_date);
            if (query['time'] == undefined) {
                query['time'] = { $gte: start };
            } else {
                query['time']['$gte'] = start;
            }
        };
        if (req.query.end_time != null) {
            let end = new Date(req.query.end_time);
            if (query['time'] == undefined) {
                query['time'] = { $lte: end };
            } else {
                query['time']['$lte'] = end;
            }
        }

        if (req.query.department != null || req.query.doctor_name != null) {
            doctor_ids = await doctorIdFromName(req.query.doctor_name, req.query.department);
            query['doctor_id'] = { $in: doctor_ids };
        }


        console.log(query);
        orders = await order.find(query).exec();
        let ret = [];
        for (let i = 0; i < orders.length; i++) {
            let ord = orders[i];
            doc = await doctor.findById(ord.doctor_id).exec();
            user = await patient.findById(ord.user_id).exec();
            ret.push({
                order_id: ord._id,
                user_id: ord.user_id,
                doctor_id: ord.doctor_id,
                user_name: user.name,
                doctor_name: doc.name,
                time: ord.time,
                status: ord.status,
                comments: ord.comments[0].body
            });
        }

        res.json({
            status: 'success',
            data: ret
        })

    } catch (err) {
        next(err)
    };

});

router.post('/delete', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    console.log('order delete request incomes.');
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
            if (ord.status in ['TRADE_SUCCESS', 'WAIT_BUYER_PAY']) {
                await order.findByIdAndDelete(req.body.order_id).exec()
                res.json({
                    status: 'success',
                    data: {
                        msg: '订单删除成功'
                    }
                })
            } else {
                return res.json({
                    status: 'fail',
                    err: {
                        errcode: 108,
                        msg: '订单状态不支持删除'
                    }
                })
            }
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

router.get('/info', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
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
                    comments: ord.comments[0].body
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

router.post('/comment', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
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