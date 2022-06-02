var router = require('express').Router();
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');

router.get('/query', async function(req, res, next) {
    console.log('notice query request incomes.');
    let user = await patient.findById(req.query.user_id).exec();
    if (user == null) {
        res.json({
            status: 'fail',
            err: {
                errcode: 115,
                msg: '客户不存在'
            }
        })
    } else {
        ret = [];
        let orderAfterTime = new Date();
        orderAfterTime.setMonth(new Date().getMonth() - 1);
        let ann = await announce.find({
            user_id: req.query.user_id,
            date: { $gte: orderAfterTime }
        }).sort({ 'date': -1 }).exec();
        for (let i = 0; i < ann.length; i++) {
            ret.push({
                'title': ann[i].title,
                'content': ann[i].content,
                'announcer': ann[i].announcer,
                'date': ann[i].date
            })
        }
        res.json({
            status: 'success',
            data: ret
        })
    }
});

module.exports = router;