var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/query', function(req, res, next){
    console.log('doctor query request incomes.');
    res.send('TODO');
});

router.post('/addcollect', function(req, res, next){
    console.log('doctor addcollect request incomes.');
    patient.findByIdAndUpdate(
        req.body.user_id,
        {$push:{collects:req.body.doctor_id}},
        null,
        (err)=>{
            if (err) {
                console.log('user collect update error:', err)
            } else {
                console.log('user collect update success')
            }
    }).catch(next)
});

router.get('/collectlist', function(req, res, next){
    console.log('doctor collectlist request incomes.');
    try {
        const user = await patient.findById(req.user.id).exec()
        res.json({
            status: 'success',
            data:{
                collects:user.collects
            }    
        })
    } catch(err) {
        next(err)
    }
});

module.exports = router;