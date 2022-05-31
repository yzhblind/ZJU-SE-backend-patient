var router = require('express').Router();
const { default: mongoose } = require('mongoose');
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');
const { cvtScheduleToHumanInfo, cvtTimeToIdx } = require('../../tools/schedule')

router.get('/info', async function(req, res, next){
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
    let date_key = date_obj.getDay();
    console.log(date_key);
    schs = await schedule.find({date: date_key}).lean().exec();
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

router.get('/select', async function(req, res, next){
    console.log('registration select request incomes.');
    doctor_id_query = req.query.doctorId;
    date_idx = req.query.date;
    schs = await schedule.find({doctor_id: mongoose.Types.ObjectId(doctor_id_query), date:date_idx}).lean().exec();
    console.log(schs)
    quotas = [0, 0, 0]
    for(let i = 0; i < schs.length; i++) {
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

router.get('/pay', function(req, res, next){
    console.log('registration pay status request incomes.');
    res.send('TODO');
});

router.post('/form', function(req, res, next){
    console.log('registration form request incomes.');
    res.send('TODO');
});

module.exports = router;