var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/query', async function(req, res, next){
    console.log('doctor query request incomes.');
    let doctor_name = req.query.name;
    let depart_name = req.query.depart;
    let doctors = await doctor.find({name: doctor_name}).lean().exec();
    let filtered_doctors = []
    for(let i in doctors) {
        dept_doctor = (await department.find({_id: doctors[i].dept_id}).lean().exec())[0].name;
        console.log(dept_doctor);
        console.log(depart_name);
        if(dept_doctor == depart_name) {
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

router.post('/addcollect',async function(req, res, next){
    console.log('doctor addcollect request incomes.')

    try{
        const p=await patient.findByIdAndUpdate(
            req.body.params.user_id,
            {"$addToSet":{"collect":{doctor_id:req.body.params.doctor_id}}},
            {"upsert":true}
        ).exec()

        if(p==null){
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
    }
    catch(error){
        next(error)
    }

});

router.get('/collectlist', async function(req, res, next){
    console.log('doctor collectlist request incomes.');
    try {
        const user = await patient.findById(req.query.user_id).exec()
        if(user==null){
            return res.json({
                status: 'fail',
                data:{
                    msg:'患者不存在'
                }    
            })
        }
        return res.json({
            status: 'success',
            data:{
                collects:user.collect
            }    
        })
    } catch(err) {
        next(err)
    }
});

module.exports = router;