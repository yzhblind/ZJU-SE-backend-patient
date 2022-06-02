const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../models');
const { default: mongoose } = require('mongoose');
const { db } = require('../models/announce');

async function doctorIdFromName(doctor_name, depart_name) {
    let query = {},
        ret = [];
    if (depart_name != null && depart_name != '') {
        let depart = await department.findOne({ name: depart_name }).exec();
        query['dept_id'] = mongoose.Types.ObjectId(depart._id);
    };
    if (doctor_name != null && doctor_name != '') {
        query['name'] = doctor_name;
    }

    let doctorids = await doctor.find(query, { _id: 1 }).exec();
    for (let i = 0; i < doctorids.length; i++) {
        ret.push(doctorids[i]['_id']);
    }
    return ret;
}


async function orderStatusCheck() {
    let orderCloseTime = new Date();
    orderCloseTime.setMinutes(new Date().getMinutes() - 20);
    await order.updateMany({
        'status': 'WAIT_BUYER_PAY',
        'time': { $lt: orderCloseTime }
    }, {
        $set: {
            'status': 'TRADE_CLOSED'
        }
    });
    return;
}

function validQuery(key) {
    return key != null && key != '';
}

function DateToHumanInfo(date) {

}

module.exports = { doctorIdFromName, orderStatusCheck, validQuery };