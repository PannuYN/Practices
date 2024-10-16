const db = require('../database');
const { RETURN_CODES, SERVER_STATUS } = require('../api_return_codes.js');
const { validateRequest, idSchema } = require('../validation.js');
const crypto = require('crypto');
const util = require('util');
const { ENCRYPT_DECRYPT } = require('../config.js');

function getAll(query, response) {
    db.query(query, (err, results) => {
        //check for database errors
        if (err){
            response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
            .json({code: RETURN_CODES.SYSTEM_ERROR, error: err});
        }
        //if no error, send ok response
        response.status(SERVER_STATUS.OK).json({code: RETURN_CODES.SUCCESSFUL, result: results});
    })
}

function getById(query, id, response) {
    //validate the input
    if(!validateRequest(id, idSchema, response))
        return;
    //if no error, execute the query
    db.query(query, [id], (err, results) => {
        //check for database errors
        if (err){
            response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
            .json({code: RETURN_CODES.SYSTEM_ERROR, error: err});
        }
        //if no data is found
        if(results[0].length == 0){
            response.status(SERVER_STATUS.NOT_FOUND)
            .json({code: RETURN_CODES.RETURN_EMPTY_SET, message: results});
        }
        //if no error, send ok response
        response.status(SERVER_STATUS.OK).json({code: RETURN_CODES.SUCCESSFUL, result: results});
    })
}

function deleteById(query, id, response) {
    //validate the input
    if(!validateRequest(id, idSchema, response))
        return;
    //if no error, execute the query
    db.query(query, [id], (err, results) => {
        //check for database errors
        if (err){
            response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
            .json({code: RETURN_CODES.SYSTEM_ERROR, error: err});
        }
        //if no error, send ok response
        response.status(SERVER_STATUS.OK).json({code: RETURN_CODES.SUCCESSFUL, result: results});
    });
}

function createNewOne(query, req_body_arr, response) {
    db.query(query, req_body_arr, (err, results) => {
        //check for database errors
        if (err){
            if(err.errno == 1001){ //check if error is caught by custom validation
                response.status(SERVER_STATUS.BAD_REQUEST)
                .json({code: RETURN_CODES.INVALID_INPUT, error: err});
            }
            else{ //else, it would be system error
                response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
                .json({code: RETURN_CODES.SYSTEM_ERROR, error: err});
            }
        }
        //if no error, send ok response
        response.status(SERVER_STATUS.CREATED).json({code: RETURN_CODES.SUCCESSFUL, result: results});
    });
}

function updateExistingOne(query, req_body_arr, response) {
    db.query(query, req_body_arr, (err, results) => {
        //check for database errors
        if (err){
            if(err.errno == 1001){ //check if error is caught by custom validation
                response.status(SERVER_STATUS.BAD_REQUEST)
                .json({code: RETURN_CODES.INVALID_INPUT, error: err});
            }
            else{ //else, it would be system error
                response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
                .json({code: RETURN_CODES.SYSTEM_ERROR, error: err});
            }
        }
        //if no error, send ok response
        response.status(SERVER_STATUS.CREATED).json({code: RETURN_CODES.SUCCESSFUL, result: results});
    });
}

const queryAsync = util.promisify(db.query).bind(db);
async function getUserWithEmail(email, res) {
    try {
        const results = await queryAsync('call getUserDetailByEmail(?);', [email]);
        if(results[0].length == 0) {
            response.status(SERVER_STATUS.BAD_REQUEST)
           .json({ code: RETURN_CODES.INCORRECT_EMAIL, result: results });
           return "no user";
        }
        const user = results[0][0];
        return user;
    }
    catch(err){
        res.json(err);
    }
} 
async function authenticate(query, req_body, response) {
    const {email, password} = req_body;
    try {
        const results = await queryAsync(query, [email]); //execute query
        //check account existence
        if(results[0].length == 0) {
            response.status(SERVER_STATUS.BAD_REQUEST)
           .json({ code: RETURN_CODES.INCORRECT_EMAIL, result: results });
           return;
        }
        const encrypted_password = results[0][0].password;
        const decrypted_password = decrypt(encrypted_password);
        //decrypt the password and authenticate
        if(decrypted_password === password){
            response.json({status: "login success", encrypted: encrypted_password, decrypted: decrypted_password});
        }
        else{
            response.json({status: "login fail"});
        }
    } catch (err) {
        response.status(SERVER_STATUS.INTERNAL_SERVER_ERROR)
           .json({ code: RETURN_CODES.SYSTEM_ERROR, error: err });
        return;
    }
}

function encrypt(data) {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(ENCRYPT_DECRYPT.algorithm, ENCRYPT_DECRYPT.secret_key, iv);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted; //add iv to the encrypted data
}
function decrypt(encrypted_data) {
    //extracting iv
    const splitted_data = encrypted_data.split(':');
    const iv = Buffer.from(splitted_data[0], 'hex');  // Extract the IV
    const real_data = splitted_data[1];

    let decipher = crypto.createDecipheriv(ENCRYPT_DECRYPT.algorithm, ENCRYPT_DECRYPT.secret_key, iv);
    let decrypted = decipher.update(real_data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}



module.exports = {
    getAll, getById, deleteById,
    createNewOne, updateExistingOne,
    authenticate,
    encrypt, decrypt,
    getUserWithEmail
}