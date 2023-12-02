const express = require('express');
const router = express.Router();

const { createResultController,
    getResultsForStudentController,
    getResultsForQuizController,
    updateResultController,
    deleteResultController,
    calculateOverallScoreForQuizController } = require
        ('../controllers/result.controller');
const { createResultValidator ,updateResultValidator} = require('../validaters/result.validator');


// get routes
router.get('/result-student/:StudentID', getResultsForStudentController);
router.get('/result-quiz/:quizID', getResultsForQuizController);
router.get('/result/:quizID/overall-score', calculateOverallScoreForQuizController);

// post routes
router.post('/result', createResultValidator, createResultController);

// put routes
router.put('/result/:ResultID', updateResultController ,updateResultController);

// delete routes
router.delete('/result/:ResultID', deleteResultController);



module.exports = router;

