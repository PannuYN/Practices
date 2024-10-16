const express = require('express');
const passport = require('passport');
const passportConfig = require('./passportConfig');

const app = express(); //create express obj
// Use express.json to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//defining port (important to start the server)
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const userDetailRoutes = require('./routes/userDetailRoutes');
app.use('/api/users', userDetailRoutes);
