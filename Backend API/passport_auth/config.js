const crypto = require('crypto');

const DB_CONFIG = {
    host: 'localhost',
    user: 'root',
    password: 'pan12345!',
    database: 'passport_auth',
    port: 3306, // Optional
};

const ENCRYPT_DECRYPT = {
    secret_key: "12345678123456781234567812345678",
    algorithm: "aes-256-cbc"
}


module.exports = {
    DB_CONFIG, ENCRYPT_DECRYPT, JWT_SECRET: 'my_jwt_secret_key'
};

//module.exports = config; (export all)