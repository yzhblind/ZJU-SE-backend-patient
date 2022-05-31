var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

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

router.get('/query', function(req, res, next){
    console.log('department query request incomes.');
    
});

module.exports = router;