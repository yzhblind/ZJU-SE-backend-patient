const mongoose = require('./db');

// YAY: add doctor_un as doctor's "username",
// just like our 3190102100 student id
const doctorSchema = mongoose.Schema({
    doctor_un: String,
    name: String,
    gender: String,
    age: Number,
    dept_id: mongoose.Schema.Types.ObjectId,
    position: String,
    password: String,
    intro: String,
    photo: String, // photo link
});

module.exports = mongoose.model('doctor', doctorSchema);