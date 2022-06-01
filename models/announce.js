const mongoose = require("./db");

const announceSchema = mongoose.Schema({
    title: String,
    content: String,
    announcer: String,
    user_id: mongoose.Schema.Types.ObjectId,
    date: Date
});

module.exports = mongoose.model("announce", announceSchema);