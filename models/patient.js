const { Schema } = require('mongoose');
const mongoose = require('./db');

// YAY: I think there is a duplicated "gender" here

const patientSchema = mongoose.Schema({
    gender: String,
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
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
    height:{
        type:String
    },
    weight:{
        type:String
    },
    collect:[],
    pic_id:{
        type:String
    }
});

module.exports = mongoose.model('patient', patientSchema);