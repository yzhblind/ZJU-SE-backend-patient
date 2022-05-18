var router = require('express').Router();

router.post('/', function(req, res, next){
    console.log('register request incomes.');
    res.send('TODO');
});

module.exports = router;