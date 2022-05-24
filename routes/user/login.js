var router = require('express').Router();

router.post('/pwd', function(req, res, next){
    console.log('login passward request incomes.');
    res.send('TODO');
});

router.post('/idcode', function(req, res, next){
    console.log('login identifying code request incomes.');
    res.send('TODO');
});

module.exports = router;