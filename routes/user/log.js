var router = require('express').Router();

router.get('/log', function(req, res, next){
    console.log('log request incomes.');
    res.send('TODO');
});

module.exports = router;