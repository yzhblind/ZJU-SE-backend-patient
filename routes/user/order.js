var router = require('express').Router();
const { query } = require('express');
const passport = require('passport')
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

const { default: mongoose } = require('mongoose');
const { doctorIdFromName, orderStatusCheck, validQuery } = require('../../tools/order');
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

        if (validQuery(req.query.order_id)) {
            query['_id'] = mongoose.Types.ObjectId(req.query.order_id);
        }
        if (validQuery(req.query.status)) {
            query['status'] = req.query.status;
        };
        if (validQuery(req.query.start_time)) {
            let start = new Date(req.query.start_time);
            if (query['time'] == undefined) {
                query['time'] = { $gte: start };
            } else {
                query['time']['$gte'] = start;
            }
        };
        if (validQuery(req.query.end_time)) {
            let end = new Date(req.query.end_time);
            if (query['time'] == undefined) {
                query['time'] = { $lte: end };
            } else {
                query['time']['$lte'] = end;
            }
        }

        if (validQuery(req.query.doctor_name) || validQuery(req.query.department)) {
            doctor_ids = await doctorIdFromName(req.query.doctor_name, req.query.department);
            query['doctor_id'] = { $in: doctor_ids };
        }


        // console.log(query);
        orderStatusCheck();
        orders = await order.aggregate([{
            $lookup: {
                from: 'doctors',
                localField: 'doctor_id',
                foreignField: '_id',
                as: 'doctor_info'
            }
        }, {
            $lookup: {
                from: 'patients',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user_info'
            }
        }, {
            $match: query
        }, {
            $sort: { time: -1 }
        }]);

        // orders = await order.find(query).sort({
        //     time: -1
        // }).exec();

        let ret = [];
        for (let i = 0; i < orders.length; i++) {
            ret.push({
                order_id: orders[i]._id,
                user_id: orders[i].user_id,
                doctor_id: orders[i].doctor_id,
                user_name: orders[i].user_info[0].name,
                doctor_name: orders[i].doctor_info[0].name,
                time: orders[i].time,
                status: orders[i].status
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
        const ord = await order.findById(req.body.params.order_id).exec()
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
            if (ord.status==="WAIT_BUYER_PAY" || ord.status.status=="TRADE_CLOSED") {
                await order.findByIdAndDelete(req.body.params.order_id).exec()
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

router.post('/comment', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    console.log('order comment request incomes.');
    try {
        const ord = await order.findById(req.body.params.order_id).exec()
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
            order.updateOne({ _id: req.body.params.order_id }, {
                $push: {
                    comments: {
                        body: req.body.params.content,
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