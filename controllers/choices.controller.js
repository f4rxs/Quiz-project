const { createChoice, updateChoice, deleteChoice, getChoicesByQuestionID, getChoicesByQuizId, getCorrectChoicesOfAQuiz } = require('../services/choices.service');
const { validationResult } = require('express-validator');

/**
 * Controller for creating a new choice.
 * Validates the input, creates a new choice in the database, and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 *
 * @returns {void} - Sends a JSON response indicating the status of the choice creation.
 */
const createChoiceController = async (req, res) => {
  // Validate input using validationResult from an Express-validator middleware.
  const errors = validationResult(req);

  // If there are validation errors, respond with a 400 Bad Request status and the error details.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract QuestionID, ChoiceText, and IsCorrect from the request body.
  const { QuestionID, ChoiceText, IsCorrect } = req.body;

  try {
    // Attempt to create a new choice in the database using the createChoice function.
    const result = await createChoice(QuestionID, ChoiceText, IsCorrect);

    // Check the result of the creation operation and respond accordingly.
    if (result.affectedRows === 1) {
      // If a choice is created successfully, respond with a 201 Created status and a success message.

      res.redirect(`/quizsystem/add-choices/${QuestionID}`);
      // res.status(201).json({ message: 'Choice created successfully' });
    } else {
      // If the choice creation failed, respond with a 500 Internal Server Error status and an error message.
      res.status(500).json({ message: `Choice creation failed` });


    }
  } catch (error) {
    // If an error occurs during the choice creation process, log the error and respond with a 500 Internal Server Error status.
    console.error('Error in createChoiceController:', error);
    res.status(500).json({ message: 'An error occurred during choice creation' });
  }
};

/**
 * Controller for updating a choice.
 * Validates the input, updates the choice in the database, and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} - Sends a JSON response indicating the status of the choice update.
 */
const updateChoiceController = async (req, res) => {
  // Extract choiceID from the request parameters.
  const { choiceID } = req.params;
  // Extract choiceText and isCorrect from the request body.
  const { choiceText, isCorrect } = req.body;

  try {
    // Attempt to update the choice in the database using the updateChoice function.
    const result = await updateChoice(choiceID, choiceText, isCorrect);

    // Check the result of the update operation and respond accordingly.
    if (result.affectedRows === 1) {
      // If a choice is updated successfully, respond with a 200 OK status and a success message.
      res.status(200).json({ message: 'Choice updated successfully' });
    } else {
      // If the choice with the provided choiceID is not found, respond with a 404 Not Found status and an error message.
      res.status(404).json({ message: `Choice with ID ${choiceID} not found - Update failed` });
    }
  } catch (error) {
    // If an error occurs during the choice update process, log the error and respond with a 500 Internal Server Error status.
    console.error('Error in updateChoiceController:', error);
    res.status(500).json({ message: 'An error occurred during choice update' });
  }
};


/**
 * Controller for deleting a choice.
 * Deletes the choice from the database and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 *
 * @returns {void} - Sends a JSON response indicating the status of the choice deletion.
 */
const deleteChoiceController = async (req, res) => {
  // Extract choiceID from the request parameters.
  const { choiceID } = req.params;

  try {
    // Attempt to delete the choice from the database using the deleteChoice function.
    const result = await deleteChoice(choiceID);
    // Check the result of the deletion operation and respond accordingly.
    if (result.affectedRows === 1) {

      // If a choice is deleted successfully, respond with a 200 OK status and a success message.

      res.status(200).json({ message: 'Choice deleted successfully' });
    } else {
      // If the choice with the provided choiceID is not found, respond with a 404 Not Found status and an error message.
      res.status(404).json({ message: `Choice with ID ${choiceID} not found - Deletion failed` });
    }
  } catch (error) {
    // If an error occurs during the choice deletion process, log the error and respond with a 500 Internal Server Error status
    console.error('Error in deleteChoiceController:', error);
    res.status(500).json({ message: 'An error occurred during choice deletion' });
  }
};

const getChoicesByQuestionIDController = async (req, res) => {
  try {
    const questionID = req.params.questionID;
    const choices = await getChoicesByQuestionID(questionID);

    if (choices.length > 0) {
      res.render('choices', { choices });
      // res.status(200).json(choices);
    } else {
      res.status(404).json({ message: 'No choices found for this question' });
    }
  } catch (error) {
    console.error('An error occurred in getChoicesByQuestionIDController: ', error);
    res.status(500).json({ message: 'An error occurred while fetching for the choices' });
  }
};

const getChoicesByQuizIdController = async (req, res) => {
  try {
    const { quizId } = req.params;
    const choices = await getChoicesByQuizId(quizId);
    if (choices.length > 0) {
      res.status(200).json(choices);

    } else {
      res.status(404).json({ message: `no choices found for the quiz id ${quizId}` });
    }
  } catch (error) {
    console.error('an error occured in getChoicesByQuizIdController', error);
    res.status(500).json({ message: 'error occured while fetching for choices' });
  }
};

const getCorrectChoicesOfAQuizController = async (req, res) => {
  try {

    const { quizId } = req.params;

    const correctChoices = await getCorrectChoicesOfAQuiz(quizId);

    if (correctChoices.length > 0) {
      res.json(correctChoices);

    }
    else {
      console.log(`no correct choices found for the quiz id with ${quizId}`);
    }

  } catch (error) {
    console.error("en error occured in getCorrectChoicesOfAQuizController: ", error);
    res.status(500).json({ message: 'an error occured while fetching for the choices' })
  }

};


// Export the deleteChoiceController function for use in other parts of the application.
module.exports = {
  createChoiceController,
  updateChoiceController,
  deleteChoiceController,
  getChoicesByQuestionIDController,
  getChoicesByQuizIdController,
  getCorrectChoicesOfAQuizController
}