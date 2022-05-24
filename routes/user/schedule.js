var router = require('express').Router();

router.post('/query', function(req, res, next){
    console.log('schedule query request incomes.');
    res.send('TODO');
});

module.exports = router;