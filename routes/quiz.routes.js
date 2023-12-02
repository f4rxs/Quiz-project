const express = require(`express`);
const router=express.Router();
const{createQuizController,
    getQuizByIDController,
    listQuizzesController,
    getQuizzesByInstructorIDController,
    updatedQuizController,deleteQuizByIdController,
    getQuestionsForQuizController,
}=require(`../controllers/quiz.controller`);


//get routers 
router.get('/quiz/:QuizID', getQuizByIDController);
router.get('/quiz',listQuizzesController);
router.get('/quiz/instructor/:instructorID', getQuizzesByInstructorIDController);
router.get('/quiz/questions/:QuizID',getQuestionsForQuizController);
// router.get('/quiz/result/:id',getResultsForQuizController)

//post routers
router.post("/quiz",createQuizController);

//update routers
router.put("/quiz/:QuizID",updatedQuizController);

//delete routes
router.delete("/quiz/:QuizID",deleteQuizByIdController);



module.exports=router;


