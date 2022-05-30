const {announce, department, diagnosis, doctor, order, patient, schedule} = require('../models');

module.exports.email = (email) => {
    return patient.exists({
        email:email
    }).exec();
}

module.exports.phone = (phone) => {
    return patient.exists({
        phone:phone
    }).exec();
}

module.exports.name = (name) => {
    return patient.exists({
        name:name
    }).exec();
}