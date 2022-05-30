var router = require('express').Router();
const passport = require('passport')
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

router.get('/tips', passport.authenticate('jwt', { session: false }), function(req, res, next){
    console.log('health tips request incomes.');
    if (req.user.id == req.query.user_id) {
        res.json({
            status: 'success',
            data:{
                tips: '一天一个苹果，医生远离我' // 草（x
            }    
        })
    } else {
        res.status(401).json({
            status: 'fail',
            err: {
                errcode: 106,
                msg: 'token与请求用户不匹配'
            }
        })
    }
});

module.exports = router;