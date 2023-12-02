const { check } = require('express-validator');

const validateRegisterInstructor = () => {
  return [
    check('username')
      .not()
      .isEmpty()
      .withMessage('Username is required'),

    check('email')
      .isEmail()
      .withMessage('Invalid email address'),

    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/, 'g')
      .withMessage('Password must contain at least one uppercase letter and one special character'),
  ];
};

  
const validateUpdateInstructor = () => {
  return [
    check('username')
      .optional()
      .isString()
      .withMessage('Invalid username'),

    check('email')
      .optional()
      .isEmail()
      .withMessage('Invalid email address'),

    check('password')
      .optional()
      .custom(value => {
        if (value) {
          if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
            throw new Error('Password must contain at least one uppercase letter and one special character');
          }
        }
        return true;
      })
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

const validateUpdatePassword = () => {
  return [
    // Validate the new password field
    check('newPassword')
      .optional()
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long')
      .custom((value) => {
        if (value && !/^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value)) {
          throw new Error('New password must contain at least one uppercase letter and one special character');
        }
        return true;
      }),
  ];
};


  module.exports = {
    validateRegisterInstructor,
    validateUpdateInstructor,
    validateUpdatePassword
  };
  