
const express = require('express');
const router = express.Router();
const {
  createChoiceController,
  updateChoiceController,
  deleteChoiceController,
  getChoicesByQuestionIDController, getChoicesByQuizIdController, getCorrectChoicesOfAQuizController
} = require('../controllers/choices.controller');
const {
  createChoiceValidator,
  updateChoiceValidator,
} = require('../validaters/choicesValidator');

// get routes
router.get('/choices/:questionID', getChoicesByQuestionIDController);
router.get('/choices-quiz/:quizId', getChoicesByQuizIdController);
router.get('/choices-correct/:quizId', getCorrectChoicesOfAQuizController);
router.get('/update-choice', (req, res) => {
  res.render("update-choice");
});

// post routes
router.post('/choices', createChoiceValidator, createChoiceController);

// put routes
router.put('/choices/:choiceID', updateChoiceValidator, updateChoiceController);

// delete routes
router.delete('/choices/:choiceID', deleteChoiceController);
router.get('/choices-delete/:choiceID', deleteChoiceController);

// render routes
router.get('/add-choices/:questionID', (req, res) => {
  const questionID = req.params.questionID;
  res.render('choices-question', { questionID });
});

router.get('/choices/:questionID', (req, res) => {
  const questionID = req.query.questionID;
  const questionText = req.query.questionText;

  res.render('choices', { questionID });
});

module.exports = router;
