var router = require('express').Router();

router.use('/register', require('./user/register'));
router.use('/check', require('./user/check'));
router.use('/info', require('./user/info'));
router.use('/login', require('./user/login'));
router.use('/order', require('./user/order'));
router.use('/notice', require('./user/notice'));
router.use('/doctor', require('./user/doctor'));
router.use('/schedule', require('./user/schedule'));
router.use('/department', require('./user/department'));
router.use('/registration', require('./user/registration'));
router.use('/health', require('./user/health'));
router.use('/log', require('./user/log'));

module.exports = router;