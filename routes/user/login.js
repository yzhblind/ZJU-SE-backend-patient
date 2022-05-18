var router = require('express').Router();

router.post('/', function(req, res, next){
    console.log('login request incomes.');
    res.send('TODO');
});


module.exports = router;