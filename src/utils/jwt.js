const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
    };
    
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key', {
        expiresIn: process.env.JWT_EXPIRATION || '24h'
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
};

module.exports = {
    generateToken,
    verifyToken
};