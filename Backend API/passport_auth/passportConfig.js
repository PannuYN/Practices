// passportConfig.js
const db = require('./database.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const { getUserWithEmail } = require('./controllers/generalController.js');

passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        const user = await getUserWithEmail(email);
        //const user = users.find(u => u.email === email);
        if (!user) 
            return done(null, false, { message: 'No user with that email' });
        if(password === user.password) {
            const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
            return done(null, { token });
        }
        else {
            return done(null, false, { message: 'Password incorrect' });
        }
    }
));

