var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.post('/query', function(req, res, next){
    console.log('schedule query request incomes.');
    res.send('TODO');
});

module.exports = router;