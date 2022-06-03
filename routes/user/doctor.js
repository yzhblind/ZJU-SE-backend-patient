var router = require('express').Router();
const { SchemaTypes, mongoose } = require('mongoose');
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');
const passport = require('passport')



router.get('/query', async function(req, res, next) {
    console.log('doctor query request incomes.');
    let doctor_name = req.query.name;
    let depart_name = req.query.depart;
    let doctors = await doctor.find({ name: doctor_name }).lean().exec();
    let filtered_doctors = []
    for (let i in doctors) {
        dept_doctor = (await department.find({ _id: doctors[i].dept_id }).lean().exec())[0].name;
        console.log(dept_doctor);
        console.log(depart_name);
        if (dept_doctor == depart_name) {
            filtered_doctors.push({
                name: doctors[i].name,
                doctor_id: doctors[i]._id,
                department: dept_doctor,
                age: doctors[i].age,
                intro: doctors[i].intro,
            });
        }
    }
    res.json({
        status: 'success',
        data: {
            number: filtered_doctors.length,
            doctor_list: filtered_doctors
        }
    })
});

router.post('/addcollect', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    console.log('doctor addcollect request incomes.')

    try {
        if (req.user.id == req.body.params.user_id) {
            let doctorOid = mongoose.Types.ObjectId(req.body.params.doctor_id)
            let doc = await doctor.findById(doctorOid).exec()
            if (doc == null) {
                return res.json({
                    status: 'fail',
                    data: {
                        msg: 'doctor not exist'
                    }
                })
            }
            const p = await patient.findByIdAndUpdate(
                req.body.params.user_id, { "$addToSet": { "collect": { _id: doctorOid } } }, { "upsert": true }
            ).exec()

            if (p == null) {
                return res.json({
                    status: 'fail',
                    data: {
                        msg: 'uid not exist'
                    }
                })
            }
            res.json({
                status: 'success',
                data: {
                    msg: '加入收藏成功'
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
    } catch (error) {
        next(error)
    }

});

router.get('/collectlist', passport.authenticate('jwt', { session: false }), async function(req, res, next) {
    console.log('doctor collectlist request incomes.');
    try {
        if (req.user.id == req.query.user_id) {
            const user = await patient.findById(req.query.user_id).exec()
            ret = []
            for (let item of user.collect) {
                doctor_id = item._id
                let doc = await doctor.findById(doctor_id).exec()
                if (doc != null) {
                    ret.push({
                        doctor_name: doc.name,
                        intro: doc.intro
                    })
                } else {
                    console.log('invalid doctor id:' + doctor_id)
                    console.log(item)
                }
            }
            if (user == null) {
                return res.json({
                    status: 'fail',
                    data: {
                        msg: '患者不存在'
                    }
                })
            }
            return res.json({
                status: 'success',
                data: ret
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

module.exports = router;