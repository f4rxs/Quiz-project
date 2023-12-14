const jwt = require('jsonwebtoken');

// my secret key
const SECRET_KEY = '123456789103355';

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY);
}

function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };