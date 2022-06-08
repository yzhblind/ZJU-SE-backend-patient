var router = require('express').Router();
const { default: mongoose } = require('mongoose');
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');
const {
    orderInsertCheck
} = require('../../tools/registeration')
const { cvtScheduleToHumanInfo, cvtTimeToIdx } = require('../../tools/schedule')


router.get('/info', async function(req, res, next) {
    console.log('registration info request incomes.');
    date = req.query.date;
    if (date === undefined) {
        res.status(200).json({
            status: "fail",
            err: {
                errcode: 106,
                msg: '缺少参数: date'
            }
        });
        return;
    }
    let date_obj = new Date(date);
    console.log(date_obj)
    let date_key = date_obj.getDay();
    if (isNaN(date_key)) {
        res.status(200).json({
            status: "fail",
            err: {
                errcode: 106,
                msg: '日期格式错误'
            }
        });
        return;
    }
    console.log(date_key);
    schs = await schedule.find({ date: date_key }).lean().exec();
    console.log(schs);
    let [schs_human, schs_tree] = await cvtScheduleToHumanInfo(schs)
    console.log(schs_human);
    console.log(schs_tree)
    res.json({
        status: 'success',
        data: {
            'doctorData': schs_human,
            'treeData': schs_tree
        }
    })
});

router.get('/select', async function(req, res, next) {
    console.log('registration select request incomes.');
    doctor_id_query = req.query.doctorId;
    date_idx = req.query.date;
    schs = await schedule.find({ doctor_id: mongoose.Types.ObjectId(doctor_id_query), date: date_idx }).lean().exec();
    console.log(schs)
    quotas = [0, 0, 0]
    for (let i = 0; i < schs.length; i++) {
        quotas[cvtTimeToIdx(schs[i].time)] = schs[i].quota;
    }
    console.log(quotas);
    res.json({
        status: 'success',
        data: {
            'numberOfQueue': quotas
        }
    });
});

router.get('/pay', async function(req, res, next) {
    console.log('registration pay status request incomes.');
    try {
        const ord = await order.findById(mongoose.Types.ObjectId(req.query.order_id)).exec();
        if (ord == null) {
            return res.json({
                status: 'fail',
                err: {
                    errcode: 107,
                    msg: '订单不存在'
                }
            })
        }

        if (ord.status == 'WAIT_BUYER_PAY') {
            let curTime = new Date().getTime();
            let orderTime = ord.time.getTime();
            let timeInterval = 1000 * 60 * 15; // 15 min
            if (curTime - orderTime < timeInterval) {
                order.updateOne({ _id: mongoose.Types.ObjectId(req.query.order_id) }, {
                    status: 'TRADE_SUCCESS'
                }).then(() => {
                    res.json({
                        status: 'success',
                        pay: 'pay_success',
                        data: {
                            msg: '支付成功'
                        }
                    })
                }).catch(next)
            } else {
                order.updateOne({ _id: mongoose.Types.ObjectId(req.query.order_id) }, {
                    status: 'TRADE_CLOSED'
                }).then(() => {
                    res.json({
                        status: 'fail',
                        pay: 'pay_fail',
                        data: {
                            msg: '支付超时'
                        }
                    })
                }).catch(next)
            }

        } else {
            res.json({
                status: 'fail',
                pay: 'pay_fail',
                data: {
                    msg: '该订单不处于可支付状态'
                }
            })
        }

    } catch (error) {
        next(error);
    }
});

router.post('/form', async function(req, res, next) {
    console.log('registration form request incomes.');
    try {
        const user_id = req.body.params.user_id;
        const doctor_id = req.body.params.doctor_id;
        const time = parseInt(req.body.params.time);
        checkResponse = await orderInsertCheck(user_id, doctor_id, time);
        if (checkResponse['status'] == 'fail') {
            res.json(checkResponse);
        } else {
            console.log('pass');
            var curTime = new Date();
            var deadTime = new Date();

            // curTime.setHours(time); don't need to set hours ?????

            // const p =
            //     new order({
            //         user_id: mongoose.Types.ObjectId(user_id),
            //         doctor_id: mongoose.Types.ObjectId(doctor_id),
            //         time: current,
            //         status: 'WAIT_BUYER_PAY',
            //         comment: [{ body: 'nothing to say', date: current }]
            //     });

            // p.save().then(() => console.log('register info saved')).catch(next);
            let _id;
            await order.collection.insertOne({
                user_id: mongoose.Types.ObjectId(user_id),
                doctor_id: mongoose.Types.ObjectId(doctor_id),
                time: curTime,
                status: 'WAIT_BUYER_PAY',
                comments: { body: 'nothing to say', date: curTime }
            }).then(
                result => {
                    _id = result['insertedId'];
                    // console.log(_id);
                }
            ).catch(next);

            deadTime.setDate(curTime.getDate() + 1);
            announce.collection.insertOne({
                title: '订单生成通知',
                // content: '请在'.concat(deadTime.toISOString().substring(0, 16)).concat('前及时支付订单: ').concat(_id),
                content: '请在15分钟内支付订单: '.concat(_id),
                announcer: '系统自动生成',
                user_id: mongoose.Types.ObjectId(user_id),
                date: curTime
            }).catch(next);

            res.json({
                status: 'success',
                submit: 'submit_success',
                order_id: _id,
                data: {
                    msg: '订单插入成功'
                }
            })
        }
    } catch (error) {
        next(error);
    }


});

module.exports = router;