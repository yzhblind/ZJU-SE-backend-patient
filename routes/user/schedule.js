var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');
const { cvtDate, cvtTime } = require('../../tools/schedule');

router.post('/query', async function(req, res, next){
    console.log('schedule query request incomes.');
    days = req.body.params.weekdays;
    departs = req.body.params.department;
    sch_doc_dept = await schedule.aggregate([
        {
            $lookup: {
                from: "doctors",
                localField: 'doctor_id',
                foreignField: '_id',
                as: 'doctor_inst'
            }
        },
        {
            $lookup: {
                from: "departments",
                localField: 'doctor_inst.dept_id',
                foreignField: '_id',
                as: 'dept_inst'
            }
        },
        {
            $match: {
                date: { $in: days },
                'dept_inst.name': { $in: departs }
            }
        }
    ]);
    ret = {};
    for(let i in sch_doc_dept) {
        sch = sch_doc_dept[i];
        if(ret[cvtDate(sch.date)] === undefined) {
            ret[cvtDate(sch.date)] = {
                [sch.dept_inst[0].name]: {
                    [cvtTime(sch.time)]: [sch.doctor_inst[0].name]        
                }
            }
        } else {
            if(ret[cvtDate(sch.date)][sch.dept_inst[0].name] === undefined) {
                ret[cvtDate(sch.date)][sch.dept_inst[0].name] = {
                    [cvtTime(sch.time)]: [sch.doctor_inst[0].name]        
                }
            } else {
                if(ret[cvtDate(sch.date)][sch.dept_inst[0].name][cvtTime(sch.time)] === undefined) {
                    ret[cvtDate(sch.date)][sch.dept_inst[0].name][cvtTime(sch.time)] = [sch.doctor_inst[0].name]
                } else {
                    ret[cvtDate(sch.date)][sch.dept_inst[0].name][cvtTime(sch.time)].push(sch.doctor_inst[0].name)
                }
            }
        }
    }
    console.log(ret);
    res.json({
        status: 'success',
        data: ret
    })
});

module.exports = router;