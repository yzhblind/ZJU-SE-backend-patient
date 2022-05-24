var router = require('express').Router();

router.get('/tips', function(req, res, next){
    console.log('health tips request incomes.');
    res.send('TODO');
});

module.exports = router;