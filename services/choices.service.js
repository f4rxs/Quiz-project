const { query } = require('../database/db')


/**
 * Creates a new choice for a question in the database.
 *
 * @param {number} QuestionID - The unique identifier of the question to which the choice belongs.
 * @param {string} ChoiceText - The text of the choice.
 * @param {boolean} IsCorrect - Indicates whether the choice is correct or not.
 *
 *
 * @returns {Object} - Returns a database query result containing information about the insert operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const createChoice = async (QuestionID, ChoiceText, IsCorrect) => {
    try {
        // SQL query to insert a new choice into the database.
        let sql = 'INSERT INTO choices (QuestionID, ChoiceText, IsCorrect) VALUES (?, ?, ?)';

        const isCorrectValue = IsCorrect.toLowerCase() === 'true' ? 1 : 0;
        // Execute the insert query using a database connection method
        const result = await query(sql, [QuestionID, ChoiceText, isCorrectValue]);

        // Return the result of the database insert operation, which contains information about the insert.
        return result;
    } catch (error) {
        // If an error occurs during the database insert, throw an error to be caught and handled by the calling code.
        throw new Error(error);
    }
};


/**
 * Updates a choice in the database with the provided choice text and correctness status.
 *
 * @param {number} choiceID - The unique identifier of the choice to update.
 * @param {string} choiceText - The updated text for the choice.
 * @param {boolean} isCorrect - The updated correctness status for the choice.
 *
 * @returns {Object} - Returns a database query result containing information about the update operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const updateChoice = async (choiceID, choiceText, isCorrect) => {
    try {
        // SQL query to update a choice's text and correctness status based on its unique identifier.
        const updateChoiceQuery = 'UPDATE choices SET ChoiceText = ?, IsCorrect = ? WHERE ChoiceID = ?';

        // Execute the update query using a database connection method
        const result = await query(updateChoiceQuery, [choiceText, isCorrect, choiceID]);

        // Return the result of the database update operation, which contains information about the update.
        return result;
    } catch (error) {
        // If an error occurs during the database update, throw an error to be caught and handled by the calling code.
        throw new Error(error);
    }
};


/**
 * Deletes a choice from the database based on its unique identifier.
 *
 * @param {number} choiceID - The unique identifier of the choice to delete.
 *
 * @returns {Object} - Returns a database query result containing information about the delete operation.
 *                   - The structure of the returned object depends on the database schema and query result.
 */
const deleteChoice = async (choiceID) => {
    try {
        // SQL query to delete a choice based on its unique identifier.
        const deleteChoiceQuery = 'DELETE FROM choices WHERE ChoiceID = ?';

        // Execute the delete query using a database connection method
        const result = await query(deleteChoiceQuery, [choiceID]);

        // Return the result of the database delete operation, which contains information about the delete.
        return result;
    } catch (error) {
        // If an error occurs during the database delete, throw an error to be caught and handled by the calling code.
        throw new Error(error);
    }
};

const getChoicesByQuestionID = async (questionID) => {
    try {
        const sql = 'SELECT * FROM choices WHERE QuestionID=?';
        const result = await query(sql, [questionID]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
};



const getChoicesByQuizId = async (quizId) => {
    try {
        const sql = 'SELECT * FROM choices WHERE QuestionID IN (SELECT QuestionID FROM question WHERE QuizID = ?)';
        const choices = await query(sql, [quizId]);
        return choices;
    } catch (error) {
        throw new Error(error);
    }
};

const getCorrectChoicesOfAQuiz = async (quizId) => {
    try {

        const sql = `
      SELECT q.QuestionID ,q.QuestionText , c.ChoiceID , ChoiceText
      FROM Question q
      JOIN Choices c ON q.QuestionID = c.QuestionID
      WHERE q.QuizID = ? AND c.IsCorrect = true;
    `;

        const correctChoices = await query(sql, [quizId]);
        return correctChoices;

    } catch (error) {
        throw new Error(error);

    }
};


/**
 * Exports the choices  service functions.
 */
module.exports = {
    createChoice,
    updateChoice,
    deleteChoice,
    getChoicesByQuestionID,
    getChoicesByQuizId,
    getCorrectChoicesOfAQuiz
};