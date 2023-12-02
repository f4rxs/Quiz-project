const { check, validationResult } = require('express-validator');

const validateUpdateQuestion = [
    check('questionText')
        .optional()
        .isString()
        .withMessage('Question text must be a string'),

    check('correctOption')
        .optional()
        .isString()
        .withMessage('Correct option must be a string'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


const validateCreatQuiz = [
    check('questionText').optional().
        isString().
        withMessage('Question must be string'),
    check('correctAnswer').
        optional().
        isString().
        withMessage('correct option must be a string'),
    (req, res, next) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });

        }
        next();

    }
]

module.exports = {
    validateUpdateQuestion,
    validateCreatQuiz
};