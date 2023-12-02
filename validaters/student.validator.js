const { check } = require('express-validator');

const validateRegisterStudent = () => {
    return [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username is required'),

        check('email')
            .not()
            .isEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail({ force_lower_case: true }),  
          
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g')
            .withMessage('Password must contain at least one uppercase letter and one special character'),
    ];
};

const validateUpdateStudent = () => {
    return [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username is required'),

        check('email')
            .not()
            .isEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address')
            .normalizeEmail({ force_lower_case: true }),  
          
        check('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g')
            .withMessage('Password must contain at least one uppercase letter and one special character'),
    ];
};

const ValidateChangePassword = () => {
    return [
        check('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g')
            .withMessage('Password must contain at least one uppercase letter and one special character'),
    ];
};


module.exports = {validateRegisterStudent,validateUpdateStudent,ValidateChangePassword};
