var router = require('express').Router();

const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models');
const check = require('../../tools/check')

router.get('/email', async function (req, res, next) {
    console.log('check email request incomes.');
    try{
        const email = req.query.email
        res.json({
            status:'success',
            data:{
                isExist: await check.email(email) != null
            }
        })
    } catch(err) {
        next(err)
    }
});

router.get('/name', async function (req, res, next) {
    console.log('check name request incomes.');
    try{
        const name = req.query.username
        res.json({
            status:'success',
            data:{
                isExist: await check.name(name) != null
            }
        })
    } catch(err) {
        next(err)
    }
});

router.get('/phone', async function (req, res, next) {
    console.log('check phone request incomes.');
    try{
        const phone = req.query.phone
        res.json({
            status:'success',
            data:{
                isExist: await check.phone(phone) != null
            }
        })
    } catch(err) {
        next(err)
    }
});

router.get('/idcode', async function (req, res, next) {
    console.log('check identifying code request incomes.');
    try {
        const phone = req.query.phone;
        // console.log(phone)
        if (await check.phone(phone) == null) {
            return res.json({
                status: 'fail',
                err: {
                    errcode: 103,
                    msg: '手机号不存在注册用户'
                }
            })
        }
        res.json({
            status: 'success',
            data: {
                // 没有实际搭建验证码服务，默认验证码123456
                msg: '验证码已发送'
            }
        })
    } catch (err) {
        next(err)
    }
});


module.exports = router;