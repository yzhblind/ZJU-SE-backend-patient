var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/list', function(req, res, next){
    console.log('department list request incomes.');
    res.send('TODO');
});

router.get('/query', function(req, res, next){
    console.log('department query request incomes.');
    res.send('TODO');
});

module.exports = router;