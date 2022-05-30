const mongoose = require("./db");

const announceSchema = mongoose.Schema({
    title: String,
    content: String,
    announcer: String,
    date: Date
});

module.exports = mongoose.model("announce", announceSchema);
