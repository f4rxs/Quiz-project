

const { check } = require('express-validator');

const createChoiceValidator = [
  check('QuestionID').notEmpty().withMessage('Question ID is required'),
  check('ChoiceText').notEmpty().withMessage('Choice text is required'),
  check('IsCorrect').isBoolean().withMessage('isCorrect should be a boolean'),
];

const updateChoiceValidator = [
  check('choiceText').notEmpty().withMessage('Choice text is required'),
  check('isCorrect').isBoolean().withMessage('isCorrect should be a boolean'),
];

module.exports = {
  createChoiceValidator,
  updateChoiceValidator,
};
