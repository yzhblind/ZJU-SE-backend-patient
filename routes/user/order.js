var router = require('express').Router();

router.get('/query', function(req, res, next){
    console.log('order query request incomes.');
    res.send('TODO');
});

router.get('/info', function(req, res, next){
    console.log('order info request incomes.');
    res.send('TODO');
});

router.post('/create', function(req, res, next){
    console.log('order create request incomes.');
    res.send('TODO');
});

router.post('/revoke', function(req, res, next){
    console.log('order revoke request incomes.');
    res.send('TODO');
});

router.post('/comment', function(req, res, next){
    console.log('order comment request incomes.');
    res.send('TODO');
});

module.exports = router;