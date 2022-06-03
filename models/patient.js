const mongoose = require('./db');

const patientSchema = mongoose.Schema({
    gender: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    collect: [{doctor_id:String}]
});

module.exports = mongoose.model('patient', patientSchema);