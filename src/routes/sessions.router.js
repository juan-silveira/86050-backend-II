const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const sessionsController = require('../controllers/sessions.controller');
const { authenticate } = require('../middlewares/auth');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, handleValidationErrors, sessionsController.register);

router.post('/login', loginValidation, handleValidationErrors, sessionsController.login);

router.get('/current', authenticate('current'), sessionsController.getCurrentUser);

router.post('/logout', sessionsController.logout);

module.exports = router;