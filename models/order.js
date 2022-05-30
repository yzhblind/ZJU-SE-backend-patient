const mongoose = require('./db');

const orderSchema = mongoose.Schema({
    user_id: {
        type: String,
        require: true
    },
    doctor_id:{
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['TRADE_SUCCESS','TRADE_FINISHED','WAIT_BUYER_PAY','TRADE_CLOSED']
    },
    comments: [{body:String, date:Date}]
});

module.exports = mongoose.model('order', orderSchema);