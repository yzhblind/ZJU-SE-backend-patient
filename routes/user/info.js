var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/', function(req, res, next){
    console.log('get information request incomes.');
    res.send('TODO');
});


module.exports = router;