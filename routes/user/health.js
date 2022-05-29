var router = require('express').Router();
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/tips', function(req, res, next){
    console.log('health tips request incomes.');
    res.send('TODO');
});

module.exports = router;