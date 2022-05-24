var router = require('express').Router();

router.get('/query', function(req, res, next){
    console.log('notice query request incomes.');
    res.send('TODO');
});

module.exports = router;