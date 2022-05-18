var router = require('express').Router();

router.get('/', function(req, res, next){
    console.log('get information request incomes.');
    res.send('TODO');
});


module.exports = router;