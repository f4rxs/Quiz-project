const { validationResult } = require('express-validator');
const { getQuestionById, updateQuestion, deleteQuestion, createQuestion } = require('../services/questions.service');
const { message } = require('statuses');



/**
 * Controller for retrieving a question by its unique identifier.
 * Fetches the question from the database, and sends an appropriate response.
 *
 * @param {Object} req - Express request object containing parameters.
 * @param {Object} res - Express response object for sending the HTTP response.
 *
 *
 * @returns {void} - Sends a JSON response with the retrieved question or an error message.
 */
const getQuestionByIdController = async (req, res) => {
  // Extract the questionId from the request parameters.
  const { questionId } = req.params;

  try {
    // Attempt to retrieve the question from the database using the getQuestionById function.
    const question = await getQuestionById(questionId);

    // Check if a question with the given id was found.
    if (question.length > 0) {
      // If found, respond with a 200 OK status and the retrieved question.
      res.status(200).json(question);
    } else {
      // If not found, respond with a 404 Not Found status and an error message.
      res.status(404).json({ message: `No question found with the given id -> ${questionId}` });
    }
  } catch (error) {
    // If an error occurs during the question retrieval process, log the error and respond with a 500 Internal Server Error status.
    console.error('Error in getQuestionByIdController:', error);
    res.status(500).json({ message: 'An error occurred while fetching questions.' });
  }
};

/**
 * Controller for updating a question.
 * Validates the input, updates the question in the database, and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} - Sends a JSON response indicating the status of the question update.
 */
const updateQuestionController = async (req, res) => {
  // Validate input using validationResult from an Express-validator middleware.
  const errors = validationResult(req);

  // If there are validation errors, respond with a 400 Bad Request status and the error details.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract questionId, QuestionText, and CorrectAnswer from the request parameters and body.
  const { questionId } = req.params;
  const { QuestionText, CorrectAnswer } = req.body;

  try {
    // Attempt to update the question in the database using the updateQuestion function.
    const result = await updateQuestion(questionId, QuestionText, CorrectAnswer);

    if (result.affectedRows === 1) {
      // Respond with a 200 OK status and a success message if the question is updated successfully.
      res.status(200).json({ message: "Question updated Successfuly" });
    } else {
      // Respond with a 404 status if the id is not valid
      res.status(404).json({ message: `Invalid id ${questionId} for the question ` });
    }
  } catch (error) {
    console.error('Error in updateQuestionController:', error);
    res.status(500).json({ message: 'An error occurred during question update' });
  }
};


/**
 * Controller for deleting a question.
 * Deletes the question from the database and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 *
 * @returns {void} - Sends a JSON response indicating the status of the question deletion.
 */
const deleteQuestionController = async (req, res) => {
  // Extract questionId from the request parameters.
  const { questionId } = req.params;

  try {
    // Attempt to delete the question from the database using the deleteQuestion function.
    const result = await deleteQuestion(questionId);
    // Check the result of the deletion operation and respond accordingly.
    if (result.affectedRows === 1) {
      // If a question is deleted successfully, respond with a 200 OK status and a success message.
      res.status(200).json({ message: 'Question deleted successfully' });
    } else {
      // If the provided questionId is invalid or the question is not available, respond with a 404 Not Found status and an error message.
      res.status(404).json({ message: `Invalid ID - Question is not available to delete` });
    }
  } catch (error) {
    // If an error occurs during the question deletion process, log the error and respond with a 500 Internal Server Error status.
    console.error('Error in deleteQuestionController:', error);
    res.status(500).json({ message: 'An error occurred during deletion' });
  }
};


/**
 * Controller for creating a new question.
 * Validates the input, creates a new question in the database, and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @returns {void} - Sends a JSON response indicating the status of the question creation.
 */
const createQuestionController = async (req, res) => {
  // Validate input using validationResult from an Express-validator middleware.
  const errors = validationResult(req);

  // If there are validation errors, respond with a 400 Bad Request status and the error details.
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract QuizId, QuestionText, CorrectAnswer, and InstructorID from the request body.
  const { QuizId, QuestionText, CorrectAnswer, InstructorID } = req.body;

  try {
    // Attempt to create a new question in the database using the createQuestion function.
    const result = await createQuestion(QuizId, QuestionText, CorrectAnswer, InstructorID);

    // Check the result of the creation operation and respond accordingly.
    if (result.affectedRows === 1) {
      // If a question is created successfully, respond with a 201 Created status and a success message.
      res.redirect(`/quizsystem/quiz/questions/${QuizId}`)
      // res.status(201).json({ message: 'Question created successfully' });
      // res.redirect(`/quizsystem/create-question/${QuizId}`);
    } else {
      // If the question creation failed due to a duplicate, respond with a 500 Internal Server Error status and an error message.
      res.status(500).json({ message: 'Question creation failed due to the dublicate' });
    }
  } catch (error) {
    // If an error occurs during the question creation process, log the error and respond with a 500 Internal Server Error status
    console.error('Error in createQuestionController:', error);
    res.status(500).json({ message: 'An error occurred during question creation' });
  }
};

// Export the controller function for use in routes
module.exports = {
  getQuestionByIdController,
  updateQuestionController,
  deleteQuestionController,
  createQuestionController
};