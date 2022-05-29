const mongoose = require("./db");

const scheduleSchema = mongoose.Schema({
    date: Date,
    time: String, // [morning, afternoon, evening]
    doctor_id: String,
    depart_id: String
});

module.exports = mongoose.model("schedule", scheduleSchema);
