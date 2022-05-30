var router = require('express').Router()
const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../../models')
const check = require('../../tools/check')

router.post('/', async function (req, res, next) {
    try {
        console.log('register request incomes.')
        const name = req.body.username
        const phone = req.body.phone
        const password = req.body.password
        const email = req.body.email
        const gender = req.body.gender
        if(password === undefined || password.length < 8) {
            return res.json({
                errcode:101,
                err:{
                    msg:'密码长度不足8'
                }
            })
        }
        if(await check.name(name)!=null) {
            return res.json({
                errcode:102,
                err:{
                    msg:'用户名不唯一'
                }
            })
        }
        if(await check.phone(phone)!=null) {
            return res.json({
                errcode:102,
                err:{
                    msg:'手机号不唯一'
                }
            })
        }
        if(await check.email(email)!=null) {
            return res.json({
                errcode:102,
                err:{
                    msg:'邮箱不唯一'
                }
            })
        }
        const p = new patient({
            name: name,
            phone: phone,
            password: password,
            email: email,
            gender: gender
        });
        p.save().then(() => console.log('register info saved')).catch(next)
    } catch (err) {
        next(err)
    }
});

module.exports = router;