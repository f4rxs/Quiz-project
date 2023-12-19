const express = require('express');
const router = express.Router();
const { validateUpdateQuestion, validateCreatQuiz } = require('../validaters//question.validator');
const { getQuestionByIdController, updateQuestionController, deleteQuestionController, createQuestionController } = require('../controllers/question.controller');

// get routes
router.get('/question/:questionId', getQuestionByIdController);

// put routes
router.put('/question/:questionId', validateUpdateQuestion, updateQuestionController);

// delete routes
router.delete('/question/:questionId', deleteQuestionController);

// post routes
router.post('/question', validateCreatQuiz, createQuestionController);

// render routes

router.get('/create-question', async (req, res) => {
    console.log('Session Object:', req.session);
    
    if (!req.session || !req.session.instructorID) {
        return res.status(400).send('Access denied');
    }

    const instructorID = req.session.instructorID;
    const quizID = req.query.QuizID; 

    res.render('questions', { instructorID, quizID });
});

router.get('/delete-question/:questionId',deleteQuestionController);

module.exports = router;