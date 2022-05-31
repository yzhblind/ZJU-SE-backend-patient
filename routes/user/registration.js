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
    }
    let date_obj = new Date(date);
    console.log(date_obj)
    let date_key = date_obj.getDay();
    console.log(date_key);
    schs = await schedule.find({ date: date_key }).lean().exec();
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
        };

    } catch (error) {
        next(error);
    }
});

router.post('/form', async function(req, res, next) {
    console.log('registration form request incomes.');
    try {
        const user_id = req.query.user_id;
        const doctor_id = req.query.doctor_id;
        const time = parseInt(req.query.time);
        checkResponse = await orderInsertCheck(user_id, doctor_id, time);
        if (checkResponse['status'] == 'fail') {
            res.json(checkResponse);
        } else {
            console.log('pass');
            var current = new Date();

            current.setHours(time);
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
            order.collection.insertOne({
                user_id: mongoose.Types.ObjectId(user_id),
                doctor_id: mongoose.Types.ObjectId(doctor_id),
                time: current,
                status: 'WAIT_BUYER_PAY',
                comments: { body: 'nothing to say', date: current }
            }).then(
                result => {
                    _id = result.insertedId;
                }
            ).catch(next);

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