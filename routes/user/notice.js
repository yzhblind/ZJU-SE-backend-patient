var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/query', function(req, res, next){
    console.log('notice query request incomes.');
    res.send('TODO');
});

module.exports = router;