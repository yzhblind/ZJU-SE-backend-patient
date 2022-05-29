const mongoose = require('./db');

const deptSchema = mongoose.Schema({
    dept_id: String,
    name: String,
    intro: String
});

module.exports = mongoose.model('department', deptSchema);