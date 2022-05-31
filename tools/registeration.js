const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../models');

async function orderInsertCheck(user_id, doctor_id, time) {
    try {
        if (user_id == undefined) {
            return {
                status: 'fail',
                err: {
                    errcode: 110,
                    msg: '订单id缺失'
                }
            };
        } else if (doctor_id == undefined) {
            return {
                status: 'fail',
                err: {
                    errcode: 111,
                    msg: '医生id缺失'
                }
            };
        } else if (time * (time - 24) > 0) {
            return {
                status: 'fail',
                err: {
                    errcode: 112,
                    msg: '订单时间非法'
                }
            };
        } else {
            let u = await patient.findById(user_id).exec();
            let d = await doctor.findById(doctor_id).exec();
            if (u.length == 0) {
                return {
                    status: 'fail',
                    err: {
                        errcode: 113,
                        msg: '订单患者不存在'
                    }
                };
            } else if (d.length == 0) {
                return {
                    status: 'fail',
                    err: {
                        errcode: 114,
                        msg: '订单医生不存在'
                    }
                };
            } else {
                return {
                    status: 'pass',
                };
            }
        }
    } catch (err) {
        next(err)
    }
}


module.exports = { orderInsertCheck };