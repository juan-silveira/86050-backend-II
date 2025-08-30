const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const usersController = require('../controllers/users.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const createUserValidation = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('age').isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const updateUserValidation = [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('age').optional().isInt({ min: 1 }).withMessage('Age must be a positive number'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
];

const updatePasswordValidation = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

router.get('/', authenticate('jwt'), authorize('admin'), usersController.getAllUsers);

router.get('/:id', authenticate('jwt'), usersController.getUserById);

router.post('/', 
    authenticate('jwt'), 
    authorize('admin'), 
    createUserValidation, 
    handleValidationErrors, 
    usersController.createUser
);

router.put('/:id', 
    authenticate('jwt'), 
    updateUserValidation, 
    handleValidationErrors, 
    usersController.updateUser
);

router.put('/:id/password', 
    authenticate('jwt'), 
    updatePasswordValidation, 
    handleValidationErrors, 
    usersController.updatePassword
);

router.delete('/:id', 
    authenticate('jwt'), 
    authorize('admin'), 
    usersController.deleteUser
);

module.exports = router;