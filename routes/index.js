var router = require('express').Router();

router.use('/register', require('./user/register'));
router.use('/check', require('./user/check'));
router.use('/info', require('./user/info'));
router.use('/login', require('./user/login'));

module.exports = router;