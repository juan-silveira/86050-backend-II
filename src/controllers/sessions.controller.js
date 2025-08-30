const passport = require('passport');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

const register = async (req, res, next) => {
    passport.authenticate('register', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(400).json({ 
                error: info ? info.message : 'Registration failed' 
            });
        }
        
        const token = generateToken(user);
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: user.toJSON()
        });
    })(req, res, next);
};

const login = async (req, res, next) => {
    passport.authenticate('login', { session: false }, async (err, user, info) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ 
                error: info ? info.message : 'Login failed' 
            });
        }
        
        const token = generateToken(user);
        
        res.json({
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    })(req, res, next);
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            user: user.toJSON()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = (req, res) => {
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    getCurrentUser,
    logout
};