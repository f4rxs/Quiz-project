const express = require(`express`);
const router = express.Router();
const { query } = require('../database/db');
const { createQuizController,
    getQuizByIDController,
    listQuizzesController,
    getQuizzesByInstructorIDController,
    updatedQuizController, deleteQuizByIdController,
    getQuestionsForQuizController, getQuestionsWithChoicesOfAQuizController
} = require(`../controllers/quiz.controller`);


//get routers 
router.get('/quiz/:QuizID', getQuizByIDController);
router.get('/quiz', listQuizzesController)
router.get('/quiz/instructor/:instructorID', getQuizzesByInstructorIDController);
router.get('/quiz/questions/:QuizID', getQuestionsForQuizController);
router.get('/quiz/questionsAndChoices/:quizID', getQuestionsWithChoicesOfAQuizController);

//post routers
router.post("/quiz", createQuizController);

//update routers
router.put("/quiz/:QuizID", updatedQuizController);

//delete routes
router.delete("/quiz/:QuizID", deleteQuizByIdController);



// render routes
router.get('/create-quiz', async (req, res) => {
    try {
        console.log('Session Object:', req.session);
        if (!req.session || !req.session.instructorID) {
            return res.status(400).send('Access denid');
        }

        const instructorID = req.session.instructorID;

        res.render('quizPage', { instructorID });
    } catch (error) {
        console.error('Error fetching instructor ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/my-quizzes/:instructorID', getQuizzesByInstructorIDController, async (req, res) => {
    try {
        console.log('Session Object:', req.session);
        const instructorID = req.session.instructorID;
        const quizzes = res.locals.quizzes;


        res.render('instructor-quizzes', { instructorID, quizzes });

    } catch (error) {
        console.error('Error in fethcing instructor ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/update-quiz/:QuizID', updatedQuizController, (req, res) => {

});


router.get('/delete-quiz/:QuizID', deleteQuizByIdController);



module.exports = router;


