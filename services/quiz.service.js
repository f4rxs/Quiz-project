const { message } = require('statuses');
const { query } = require('../database/db');



/**
 * Creates a new quiz.
 *
 * This function is responsible for creating a new quiz in the database. It validates the
 * instructor ID, and if the instructor exists, it inserts the quiz details into the database.
 *
 * @param {Object} quiz - The quiz object containing the details of the quiz.
 * @param {string} quiz.instructorID - The ID of the instructor creating the quiz.
 * @param {string} quiz.title - The title of the quiz.
 * @param {string} quiz.description - The description of the quiz.
 * @param {number} quiz.timeLimit - The time limit (in minutes) for completing the quiz.
 *
 * @returns {Object} - The result of the quiz creation operation.
 * If successful, it returns an object containing information about the quiz creation.
 * If the specified instructor does not exist, it throws an error indicating the issue.
 *
 */
const createQuiz = async (quiz) => {
    try {
        const { instructorID, title, description, timeLimit } = quiz;
        // Check if the specified instructor exists
        const checkInstructorQuery = 'SELECT * FROM instructor WHERE InstructorID = ?';
        const instructorResult = await query(checkInstructorQuery, [instructorID]);

        if (instructorResult.length === 0) {
            throw new Error(`Instructor with ID ${instructorID} does not exist.`);
        }

        // Insert the quiz details into the database
        let sql = `INSERT INTO quiz (InstructorID, Title, Description, TimeLimit) VALUES (?, ?, ?, ?);`;

        const result = await query(sql, [instructorID, title, description, timeLimit]);

        return result;
    } catch (error) {
        // Throw an error with details if an issue occurs during quiz creation
        throw new Error(error);
    }
};


/**
 * Retrieves quiz information by ID.
 *
 * This function fetches information about a quiz from the database based on the provided QuizID.
 *
 * @param {string} QuizID - The unique identifier of the quiz to retrieve.
 *
 * @returns {Object} - The result of the quiz retrieval operation.
 * If successful, it returns an object containing information about the requested quiz.
 * If no quiz is found with the specified ID, an empty array is returned.
 *
 */
const getQuizByID = async (QuizID) => {
    try {
        // SQL query to select quiz information based on the QuizID
        const sql = 'SELECT * FROM quiz WHERE QuizID = ?';

        // Execute the query and retrieve the result
        const result = await query(sql, [QuizID]);

        return result;
    } catch (error) {
        // Throw an error with details if an issue occurs during quiz retrieval
        throw new Error(error);
    }
};


/**
 * Retrieves a list of all quizzes.
 *
 * This function fetches information about all quizzes stored in the database.
 *
 * @returns {Array} - An array containing information about all quizzes.
 * If no quizzes are found, an empty array is returned.
 *
 */
const listQuizzes = async () => {
    try {
        // SQL query to select all quiz information
        const sql = 'SELECT * FROM quiz';

        // Execute the query and retrieve the list of quizzes
        const quizzes = await query(sql);

        return quizzes;

    } catch (error) {
        // Throw an error with details if an issue occurs during quiz retrieval
        throw new Error(error);

    }

};

/**
 * Retrieves quizzes associated with a specific instructor.
 *
 * This function fetches information about quizzes that belong to a particular instructor
 * based on the provided instructor ID.
 *
 * @param {string} instructorID - The unique identifier of the instructor whose quizzes are to be retrieved.
 *
 * @returns {Array} - An array containing information about quizzes associated with the specified instructor.
 * If no quizzes are found, an empty array is returned.
 *
 */
const getQuizzesByInstructorID = async (instructorID) => {
    try {
        // SQL query to select quizzes associated with the specified instructor ID
        const sql = `SELECT * FROM quiz WHERE InstructorID = ?`;

        // Execute the query and retrieve the list of quizzes
        const result = await query(sql, [instructorID]);
        return result;
    } catch (error) {
        // Throw an error with details if an issue occurs during quiz retrieval
        throw new Error(error);
    }
};


/**
 * Updates the details of an existing quiz.
 *
 * This function modifies the details of an existing quiz based on the provided quiz ID and updated information.
 * It checks for the existence of another quiz with the same title, description, or time limit to prevent conflicts.
 *
 * @param {number} quizId - The unique identifier of the quiz to be updated.
 * @param {Object} updatedQuiz - An object containing the updated information for the quiz, including Title, Description, and TimeLimit.
 * @returns {Object} - An object containing a message indicating the success or failure of the quiz update.
 *
 */
const updateQuiz = async (quizId, updatedQuiz) => {
    const { Title, Description, TimeLimit } = updatedQuiz;

    try {
        // Check for the existence of another quiz with the same title, description, or time limit
        const checkExistingQuery = "SELECT * FROM quiz WHERE (Title=? AND Description=?) AND QuizID != ?";
        const existingQuiz = await query(checkExistingQuery, [Title, Description, quizId]);



        // If another quiz with similar details exists, return an error message
        if (existingQuiz.length > 0) {
            return { message: "Error: The quiz with the same Title, Description, or TimeLimit already exists" };
        } else {
            // Update the quiz details if no conflicts are found
            const updateQuery = "UPDATE quiz SET Title=?, Description=?, TimeLimit=? WHERE QuizID=?";
            const result = await query(updateQuery, [Title, Description, TimeLimit, quizId]);
            // Check the affected rows to determine the success of the update
            if (result.affectedRows === 1) {
                return { message: "Quiz updated successfully" };
            } else {
                return { message: "Error: Quiz update failed" };
            }
        }
    } catch (error) {
        // Throw an error with details if an issue occurs during quiz update
        throw new Error(error);
    }
};


/**
 * Deletes a quiz by its unique identifier.
 *
 * This function removes a quiz from the database based on its unique identifier (QuizID).
 *
 * @param {number} QuizID - The unique identifier of the quiz to be deleted.
 * @returns {Object} - An object containing information about the deletion operation.
 */
const deleteQuizById = async (QuizID) => {
    try {
        // SQL query to delete the quiz by its unique identifier
        const deleteQuizQuery = 'DELETE FROM quiz WHERE QuizID=?';

        // Execute the query with the provided QuizID
        const result = await query(deleteQuizQuery, [QuizID]);

        // Return the result of the deletion operation
        return result;
    } catch (error) {
        // Throw an error with details if an issue occurs during quiz deletion
        throw new Error(error);
    }
};


/**
 * Retrieves questions associated with a specific quiz.
 *
 * This function fetches questions from the database that are associated with a particular quiz,
 * identified by its unique identifier (QuizID).
 *
 * @param {number} QuizID - The unique identifier of the quiz for which questions are to be retrieved.
 * @returns {Object[]} - An array of objects containing information about each question,
 * including QuestionID, QuestionText, and CorrectAnswer.
 *
 * @throws Will throw an error if there is an issue during the question retrieval process.
 * The error message will provide details about the error.
 */
const getQuestionsForQuiz = async (QuizID) => {
    try {
        // SQL query to retrieve questions for a specific quiz based on its unique identifier
        const questionQuery = 'SELECT QuestionID, QuestionText, CorrectAnswer FROM question WHERE QuizID=?';

        // Execute the query with the provided QuizID
        const result = await query(questionQuery, [QuizID]);

        // Return the array of objects containing information about each question
        return result;

    } catch (error) {
        // Throw an error with details if an issue occurs during question retrieval
        throw new Error(error);
    }
};


const getQuestionsWithChoicesOfAQuiz = async (quizID) => {
    try {
        const result = await query(
            'SELECT q.QuestionID, q.QuestionText, c.ChoiceID, c.ChoiceText, c.IsCorrect ' +
            'FROM Question q ' +
            'JOIN Choices c ON q.QuestionID = c.QuestionID ' +
            'WHERE q.QuizID = ?',
            [quizID]
        );

        const questions = [];
        let currentQuestion = null;

        for (const row of result) {
            if (!currentQuestion || currentQuestion.QuestionID !== row.QuestionID) {
                
                currentQuestion = {
                    QuestionID: row.QuestionID,
                    QuestionText: row.QuestionText,
                    choices: [],
                };
                questions.push(currentQuestion);
            }

            // Add choice to the current question's choices array
            currentQuestion.choices.push({
                ChoiceID: row.ChoiceID,
                ChoiceText: row.ChoiceText,
                IsCorrect: row.IsCorrect,
            });
        }

        return questions;
    } catch (error) {
        throw new Error(error);
    }
};







// Export the functions for use in other modules
module.exports = {
    createQuiz,
    getQuizByID,
    listQuizzes,
    getQuizzesByInstructorID,
    updateQuiz,
    deleteQuizById,
    getQuestionsForQuiz,
    getQuestionsWithChoicesOfAQuiz
}

