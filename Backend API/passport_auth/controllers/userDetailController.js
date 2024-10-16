const { idSchema, validateRequest, userSchema } = require('../validation.js');
const { getAll, getById, deleteById, createNewOne, updateExistingOne, encrypt, decrypt, authenticate, getUserWithEmail } = require('./generalController.js');
const db = require('../database.js')
// controllers/userController.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

async function getAllUsers(req, res) {
    /*const query = 'CALL getAllUserDetails();';
    getAll(query, res);*/
    const user = await getUserWithEmail("pannu1@email.com", res);
    res.json(user);
    //getUserWithEmail("pannu1@email.com", res);
};

exports.getUserById = (req, res) => {
    //prepare parameters
    const query = 'CALL getUserDetail(?);';
    const id = req.params.id; //fetch id from the request url
         
    //execute the query if validation is okay
    getById(query, id, res);
};

exports.deleteUserById = (req, res) => {
    //prepare parameters
    const query = 'CALL deleteUserDetail(?);'; 
    const id = req.params.id; //fetch id from the request url

    //call the function
    deleteById(query, id, res);
};

exports.createNewUser = (req, res) => {
    //input validation
    if(!validateRequest(req.body, userSchema, res))
        return;

    //prepare the parameters
    const { name, email, password, phone_no, profile_pic, last_login_datetime,
        status, created_by, updated_by} = req.body;
    const encrypted_password = encrypt(password);
    const arr = [name, email, encrypted_password, phone_no, profile_pic, last_login_datetime,
        status, created_by, updated_by];
    const query = 'CALL createUserDetail(?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Execute the query
    createNewOne(query, arr, res);
};

exports.updateExistingUser = (req, res) => {
    //validate the input
    if(!validateRequest(req.body.user_id, idSchema, res))
        return; //id validation
    if(!validateRequest(req.body, userSchema, res))
        return; //other input validation

    //prepare the parameters
    const { user_id, name, email, password, phone_no, profile_pic, last_login_datetime,
        status, created_by, updated_by} = req.body;
    const arr = [user_id, name, email, password, phone_no, profile_pic, last_login_datetime,
        status, created_by, updated_by];
    const query = 'CALL updateUserDetail(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Execute the query
    updateExistingOne(query, arr, res);
};

exports.userLogin = async (req, res) => {
    const query = 'CALL getUserDetailByEmail(?);';
    authenticate(query, req.body, res);
};

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from Authorization header

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.error("Token verification error:", err); // Debugging line
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

// Route handler to get secret_name
async function getSecretName(req, res) {
    const email = req.user.email;
    const user = await getUserWithEmail(email);
    //const user = users.find(u => u.email === email);
    if (!user) return res.sendStatus(404);
    res.json({ secret_name: user.secret_name });
};

module.exports = { getSecretName, authenticateToken, getAllUsers };