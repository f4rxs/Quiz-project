const { query } = require('../database/db');


/**
 * Retrieves a question from the database by its unique identifier.
 *
 * @param {number} questionId - The unique identifier of the question to retrieve.
 *
 * @returns {Object} - Returns a database query result containing information about the retrieved question.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const getQuestionById = async (questionId) => {
  try {
    // SQL query to retrieve a question based on its unique identifier.
    const getQuestionQuery = 'SELECT * FROM question WHERE QuestionID = ?';

    // Execute the query using a database connection method 
    const result = await query(getQuestionQuery, [questionId]);

    // Return the result of the database query, which contains information about the retrieved question.
    return result;
  } catch (error) {

    // If an error occurs during the database query, throw an error to be caught and handled by the calling code.
    throw new Error(error);
  }
};


/**
 * Updates a question in the database with the provided question text and correct answer.
 *
 * @param {number} questionID - The unique identifier of the question to update.
 * @param {string} questionText - The updated text for the question.
 * @param {string} correctAnswer - The updated correct answer for the question.
 *
 * @throws {Error} - Throws an error if there's an issue executing the database update query.
 *
 * @returns {Object} - Returns a database query result containing information about the update operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const updateQuestion = async (questionID, questionText, correctAnswer) => {
  try {

    // SQL query to update a question's text and correct answer based on its unique identifier.
    const updateQuery = 'UPDATE Question SET QuestionText = ?, CorrectAnswer = ? WHERE QuestionID = ?';

    //  Execute the update query using a database connection method
    const result = await query(updateQuery, [questionText, correctAnswer, questionID]);

    // Return the result of the database update operation, which contains information about the update.
    return result;
  } catch (error) {
    // If an error occurs during the database update, throw an error to be caught and handled by the calling code.
    throw new Error(error);
  }
};


/**
 * Deletes a question from the database based on its unique identifier.
 *
 * @param {number} questionId - The unique identifier of the question to delete.
 *
 * @returns {Object} - Returns a database query result containing information about the delete operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const deleteQuestion = async (questionId) => {
  try {

    // SQL query to delete a question based on its unique identifier.
    const deleteQuestionQuery = 'DELETE FROM question WHERE QuestionID = ?';

    // Execute the delete query using a database connection method .
    const result = await query(deleteQuestionQuery, [questionId]);

    // Return the result of the database delete operation, which contains information about the delete.
    return result;
  } catch (error) {
    // If an error occurs during the database delete, throw an error to be caught and handled by the calling code.
    throw new Error(error);
  }
};


/**
 * Creates a new question in the database for a given quiz, with the specified text, correct answer, and instructor.
 *
 * @param {number} QuizId - The unique identifier of the quiz to which the question belongs.
 * @param {string} QuestionText - The text of the new question.
 * @param {string} CorrectAnswer - The correct answer for the new question.
 * @param {number} InstructorID - The unique identifier of the instructor creating the question.
 *
 * @returns {Object} - Returns a database query result containing information about the insert operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const createQuestion = async (QuizId, QuestionText, CorrectAnswer, InstructorID) => {
  try {
    // Check if a question with the same text already exists for the given QuizId.
    const checkExistingQuery = 'SELECT * FROM question WHERE QuizId=? AND QuestionText=?';
    const existingQuestion = await query(checkExistingQuery, [QuizId, QuestionText]);

    // If a question with the same text already exists, throw an error.
    if (existingQuestion.length > 0) {
      throw new Error('A question with the same text already exists for the given QuizId.');
    }

    // SQL query to insert a new question into the database.
    const insertQuestionQuery = 'INSERT INTO question (QuizId, QuestionText, CorrectAnswer, InstructorID) VALUES (?, ?, ?, ?)';

    // Execute the insert query using a database connection method 
    const result = await query(insertQuestionQuery, [QuizId, QuestionText, CorrectAnswer, InstructorID]);

    // Return the result of the database insert operation, which contains information about the insert.
    return result;
  } catch (error) {
    // If an error occurs during the database insert, throw an error to be caught and handled by the calling code.
    throw new Error(error);
  }
};




/**
 * Exports the questions service functions.
 */
module.exports = {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  createQuestion,
};