// routes/userRoutes.js
const express = require('express');
const passport = require('passport');
//const { getSecretName } = require('../controllers/userController');
const router = express.Router();

const userDetailController = require('../controllers/userDetailController');

router.get('/', userDetailController.getAllUsers);
/* Login route
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/api/users/secret'
}));*/

router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    res.json({ token: req.user.token });
});

// Protected route for secret_name
router.post('/secret', userDetailController.authenticateToken, userDetailController.getSecretName);

/*router.post('/secret', userDetailController.authenticateToken, (req, res) => {
    res.json({ secret_name: 'This is a protected resource' });
});*/
module.exports = router;

