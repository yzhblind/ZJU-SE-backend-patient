var router = require('express').Router();

router.get('/info', function(req, res, next){
    console.log('registration info request incomes.');
    res.send('TODO');
});

router.get('/select', function(req, res, next){
    console.log('registration select request incomes.');
    res.send('TODO');
});

router.get('/pay', function(req, res, next){
    console.log('registration pay status request incomes.');
    res.send('TODO');
});

router.post('/form', function(req, res, next){
    console.log('registration form request incomes.');
    res.send('TODO');
});

module.exports = router;