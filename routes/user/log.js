var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/log', function(req, res, next){
    console.log('log request incomes.');
    res.send('TODO');
});

module.exports = router;