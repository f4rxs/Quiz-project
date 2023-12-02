
const express = require('express');
const router = express.Router();
const {
  createChoiceController,
  updateChoiceController,
  deleteChoiceController,
} = require('../controllers/choices.controller');
const {
  createChoiceValidator,
  updateChoiceValidator,
} = require('../validaters/choicesValidator');
// post routes
router.post('/choices', createChoiceValidator, createChoiceController);

// put routes
router.put('/choices/:choiceID', updateChoiceValidator, updateChoiceController);

// delete routes
router.delete('/choices/:choiceID', deleteChoiceController);

module.exports = router;
