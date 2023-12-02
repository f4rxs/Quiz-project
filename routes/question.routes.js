const express = require('express');
const router = express.Router();
const { validateUpdateQuestion,validateCreatQuiz } = require('../validaters//question.validator');
const { getQuestionByIdController, updateQuestionController, deleteQuestionController ,createQuestionController} = require('../controllers/question.controller');

// get routes
router.get('/question/:questionId', getQuestionByIdController);

// put routes
router.put('/question/:questionId', validateUpdateQuestion, updateQuestionController);

// delete routes
router.delete('/question/:questionId', deleteQuestionController);

// post routes
router.post('/question',validateCreatQuiz,createQuestionController);

module.exports = router;