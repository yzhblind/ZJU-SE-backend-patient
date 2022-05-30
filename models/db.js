const mongoose = require('mongoose');

// use data
// db.createUser({user:"userServer", pwd:"userServer", roles:[{role:"readWrite",db:"data"}]})

// 注意修改端口与启动的数据库保持一致
const url = 'mongodb://userServer:userServer@localhost:49153';
const db  = 'data';

mongoose.connect(`${url}/${db}`, {useNewUrlParser: true, useUnifiedTopology: true});

const conn = mongoose.connection;

conn.on('connected', () => {
    console.error('数据库连接成功')
});

conn.on('error', err => {
    console.error('mongoose连接失败', err)
});

module.exports = mongoose;