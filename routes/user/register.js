var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');
const tools = require('../../tools');

router.post('/', function(req, res, next){
    console.log('register request incomes.');
    const name = req.body.username;
    const phone = req.body.phone;
    const password = req.body.password;
    const email = req.body.email;
    const gender = req.body.gender;
    const p = new patient({
        name: name,
        phone: phone,
        password: password,
        email: email,
        gender: gender
    });
    p.save().then(()=>console.log('register saved'));
    res.send('TODO');
});

router.use((req, res)=>{
});

module.exports = router;