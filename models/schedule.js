const mongoose = require("./db");

const scheduleSchema = mongoose.Schema({
    date: Number, // [0,1,2,3,4,5,6]
    time: String, // [morning, afternoon, evening]
    doctor_id: mongoose.Schema.Types.ObjectId,
    quota: Number
});

module.exports = mongoose.model("schedule", scheduleSchema);
