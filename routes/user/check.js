var router = require('express').Router();

router.get('/email', function(req, res, next){
    console.log('check email request incomes.');
    res.send('TODO');
});

router.get('/phone', function(req, res, next){
    console.log('check phone request incomes.');
    res.send('TODO');
});

router.get('/idcode', function(req, res, next){
    console.log('check identifying code request incomes.');
    res.send('TODO');
});


module.exports = router;