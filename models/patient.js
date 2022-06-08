const { Schema } = require('mongoose');
const mongoose = require('./db');

// YAY: I think there is a duplicated "gender" here

const patientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender:{
        type:String,
    },
    age:{
        type:String
    },
    hereditary:{
        type:String
    },
    pastill:{
        type:String
    },
    height:{
        type:String
    },
    weight:{
        type:String
    },
    collect:[],
    pic_id:{
        type:String
    },
    health:{
        total:{
            value:{
                type:Number,
                default: 0
            },
            rate:{
                type:Number,
                default:0
            }
        },
        pulse_oximeter:{
            value:{
                type:Number,
                default: 0
            },
            rate:{
                type:Number,
                default: 0
            }
        },
        sleep_quality:{
            value:{
                type:Number,
                default: 0
            },
            rate:{
                type:Number,
                default: 0
            }
        },
        heart_rate:{
            value:{
                type:Number,
                default: 0
            },
            rate:{
                type:Number,
                default: 0
            }
        }
    }
});

module.exports = mongoose.model('patient', patientSchema);