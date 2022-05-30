var router = require('express').Router();
const passport = require('passport')
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/query', function(req, res, next){
    console.log('order query request incomes.');
    res.send('TODO');
});

router.post('/delete', function(req, res, next){
    console.log('order delete request incomes.');
    res.send('TODO');
});

router.get('/info', passport.authenticate('jwt', { session: false }), function(req, res, next){
    console.log('order info request incomes.');
    
});

router.post('/comment', passport.authenticate('jwt', { session: false }), function(req, res, next){
    console.log('order comment request incomes.');
    
});

module.exports = router;