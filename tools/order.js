const { announce, department, diagnosis, doctor, order, patient, schedule } = require('../models');
const { default: mongoose } = require('mongoose');

async function doctorIdFromName(doctor_name, depart_name) {
    let query = {},
        ret = [];
    if (depart_name != null) {
        let depart = await department.findOne({ name: depart_name }).exec();
        query['dept_id'] = mongoose.Types.ObjectId(depart._id);
    };
    if (doctor_name != null) {
        query['name'] = doctor_name;
    }

    let doctorids = await doctor.find(query, { _id: 1 }).exec();
    for (let i = 0; i < doctorids.length; i++) {
        ret.push(doctorids[i]['_id']);
    }
    return ret;
}


module.exports = { doctorIdFromName };