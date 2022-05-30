const mongoose = require('./db');

const deptSchema = mongoose.Schema({
    name: String,
    intro: String
});

module.exports = mongoose.model('department', deptSchema);