const { check } = require('express-validator');

const createResultValidator = [
    check('StudentID').isNumeric(),
    check('QuizID').isNumeric(),
    check('Score').isNumeric(),
];

const updateResultValidator = () => [
    check('ResultID').isNumeric().notEmpty(),
    check('StudentID').optional().isNumeric(),
    check('QuizID').optional().isNumeric(),
    check('Score').optional().isNumeric(),
];


module.exports = {
    createResultValidator,
    updateResultValidator
};
