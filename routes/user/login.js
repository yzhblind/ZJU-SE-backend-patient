const router = require('express').Router();
const jsonwebtoken = require('jsonwebtoken');
const key = require('../../config/keys');
const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../../models');

function issueJWT(id) {
    const expiresIn = '1d'
    const payload = {
        id : id,
        iat: Date.now()
    }
    const signedToken = jsonwebtoken.sign(payload, key.private_key, { expiresIn: expiresIn, algorithm: 'RS256' });
    return {
        token: "Bearer " + signedToken,
        expiresIn: expiresIn
    }
}

router.post('/pwd', function(req, res, next){
    console.log('login passward request incomes.');
    patient.findOne({name:req.body.params.username}).then((user)=>{
        if(!user) {
            return res.status(200).json({
                status: 'fail',
                err: {
                    errcode:104,
                    msg: '用户不存在'
                }
            })
        }

        if(user.password==req.body.params.password) {
            const tokenObj = issueJWT(user._id)
            res.status(200).json({
                status: 'success',
                data: {
                    msg: '登录成功',
                    user_id : user._id,
                    username : req.body.params.username,
                    token: tokenObj.token,
                    expiresIn: tokenObj.expiresIn
                }
            })
        } else {
            res.status(200).json({
                status: 'fail',
                err: {
                    errcode:105,
                    msg: '密码错误'
                }
            })
        }
    }).catch(next)
});

router.post('/idcode', function(req, res, next){
    console.log('login identifying code request incomes.');
    patient.findOne({phone:req.body.params.phone}).then((user)=>{
        if(!user) {
            return res.status(200).json({
                status: 'fail',
                err: {
                    errcode:104,
                    msg: '用户不存在'
                }
            })
        }

        if('123456'==req.body.params.idcode) {
            const tokenObj = issueJWT(user._id)
            res.status(200).json({
                status: 'success',
                data: {
                    msg: '登录成功',
                    user_id : user._id,
                    username : user.name,
                    token: tokenObj.token,
                    expiresIn: tokenObj.expiresIn
                }
            })
        } else {
            res.status(200).json({
                status: 'fail',
                err: {
                    errcode:105,
                    msg: '验证码错误'
                }
            })
        }
    }).catch(next)
});

module.exports = router;