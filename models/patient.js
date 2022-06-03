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
    gender:{
        type:String,
    },
    age:{
        type:String
    },
    hereditary:{
        type:String
    },
    pastill:{
        type:String
    },
    collect: [{doctor_id:String}],
    pic_id:{
        type:String
    }
});

module.exports = mongoose.model('patient', patientSchema);