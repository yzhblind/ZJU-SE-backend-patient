var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');
const { cvtDate, cvtTime } = require('../../tools/schedule');
const { appendOrCreate } = require('../../tools/utils');

async function getDoctorsFromDept(dept_id) {
    let doctors;
    try{
        doctors = await doctor.find({dept_id: dept_id}).exec();
    } catch(err) {
        return {};
    }
    info_doctor = {};
    for(let i = 0; i < doctors.length; i++) {
        let doctor = doctors[i];
        pos = doctor.position;
        if(info_doctor[pos] === undefined) {
            info_doctor[pos] = [doctor.name];
        } else {
            info_doctor[pos].push(doctor.name)
        }
    }
    return info_doctor;
}

async function getScheduleFromDept(dept_id) {
    let schedules;
    schedules = await schedule.find({}).lean().exec();
    ret_schedule = [];
    for(let i = 0; i < schedules.length; i++) {
        let doctor_inst = await doctor.find({_id: schedules[i].doctor_id}).exec();
        doctor_inst = doctor_inst[0];
        if(doctor_inst.dept_id.equals(dept_id)) {
            ret_schedule.push({
                date: cvtDate(schedules[i].date),
                time: cvtTime(schedules[i].time),
                name: doctor_inst.name,
            });
        }
    }
    return ret_schedule;
}

function mergeSchedules(schedule_data, dept_name) {
    let ret_schedule = {};
    for(let i = 0; i < schedule_data.length; i++) {
        sch = schedule_data[i];
        if(ret_schedule[sch.date] === undefined) {
            ret_schedule[sch.date] = {
                [dept_name]: {
                    [sch.time]: [sch.name]
                }
            }
        } else {
            if(ret_schedule[sch.date][dept_name] === undefined) {
                ret_schedule[sch.date][dept_name] = {
                    [sch.time]: [sch.name]
                }
            } else {
                if(ret_schedule[sch.date][dept_name][sch.time] === undefined) {
                    ret_schedule[sch.date][dept_name][sch.time] = [sch.name];
                } else {
                    ret_schedule[sch.date][dept_name][sch.time].push(sch.name);
                }
            }
        }
    }
    return ret_schedule;
}

router.get('/list', async function(req, res, next){
    console.log('department list request incomes.');
    const dept = await department.find({}).lean().exec();
    let ret = {}
    for(let i = 0; i < dept.length; i++) {
        ret[dept[i].name] = await getDoctorsFromDept(dept[i]._id);
    }
    res.json({
        status: 'success',
        data: ret
    });
});


router.get('/query', async function(req, res, next){
    console.log('department query request incomes.');
    if (req.query.depart_name === undefined) {
        res.status(200).json({
            status: "fail",
            err: {
                errcode: 106,
                msg: '缺少参数'
            }
        })
    }
    let dept_info;
    dept_info = await department.find({name: req.query.depart_name}).lean().exec();    
    if (dept_info.length == 0) {
        res.status(200).json({
            status: "fail",
            err: {
                errcode: 106,
                msg: "科室不存在"
            }
        });
    }
    console.assert(dept_info.length == 1);
    dept_info = dept_info[0];
    doctors = await getDoctorsFromDept(dept_info._id);
    doctor_names = []
    for(let pos in doctors) {
        doctor_names.push(...doctors[pos])
    }
    dept_info['doctor_list'] = doctor_names;
    let schedule_info = mergeSchedules(await getScheduleFromDept(dept_info._id), dept_info.name);
    dept_info['schedule'] = schedule_info;
    res.json({
        status: 'success',
        data: dept_info
    })
});

module.exports = router;