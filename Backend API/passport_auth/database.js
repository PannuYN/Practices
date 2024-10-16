const mysql = require('mysql2');
const { DB_CONFIG } = require('./config');

const connection = mysql.createConnection(DB_CONFIG);

connection.connect((err) => {
    if(err){
        console.error('Error connecting: ' + err.stack);
        return;
    }
    console.log('Conneted as id ' + connection.threadId);   
})

module.exports = connection;
