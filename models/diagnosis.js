const mongoose = require("./db");
const ObjectId = mongoose.Schema.Types.ObjectId;

// YAY: change these three ids from String to ObjectId

const diagnosisSchema = mongoose.Schema({
    patient_id: ObjectId,
    doctor_id: ObjectId,
    depart_id: ObjectId,
    timestamp: Date,
    diagnosis_message: String,
    medicine_message: String
});

module.exports = mongoose.model("diagnosis", diagnosisSchema);
