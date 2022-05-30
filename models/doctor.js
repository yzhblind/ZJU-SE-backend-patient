const mongoose = require('./db');

const doctorSchema = mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    dept_id: String,
    position: String,
    password: String,
    intro: String
});

module.exports = mongoose.model('doctor', doctorSchema);