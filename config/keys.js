const fs = require('fs')
const path = require('path');

module.exports = {
    private_key: fs.readFileSync(path.join(__dirname, 'jwtRS256.key'), 'utf8'),
    public_key: fs.readFileSync(path.join(__dirname, 'jwtRS256.key.pub'), 'utf8')
};
