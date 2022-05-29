const mongoose = require("./db");

const diagnosisSchema = mongoose.Schema({
    diagnosis_id: String,
    patient_id: String,
    doctor_id: String,
    depart_id: String,
    timestamp: Date,
    diagnosis_message: String,
    medicine_message: String
});

module.exports = mongoose.model("diagnosis", diagnosisSchema);
