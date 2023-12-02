const { query } = require('../database/db');


/**
 * Creates a new result entry for a student's quiz attempt.
 * Inserts the specified data into the result table and returns the result.
 * @param {number} StudentID - ID of the student attempting the quiz.
 * @param {number} QuizID - ID of the quiz for which the result is being recorded.
 * @param {number} Score - Score achieved by the student in the quiz.
 * @returns {Object} - Result of the operation.
 */
const createResult = async (StudentID, QuizID, Score) => {
    try {
        // SQL query to insert result data into the result table
        let sql = 'INSERT INTO result(StudentID,QuizID,Score) VALUES (?,?,?)';

        // Execute the query and retrieve the result
        const result = await query(sql, [StudentID, QuizID, Score]);

        // Return the result of the operation
        return result;


    } catch (error) {
        // Handle errors that occurred during the operation
        throw new Error(error);
    }
}

/**
 * Retrieves quiz results for a specific student.
 * Queries the result table for entries associated with the given StudentID.
 * @param {number} StudentID - ID of the student for whom quiz results are being retrieved.
 * @returns {Object} - Result of the operation, containing quiz results for the student.
 */
const getResultsForStudent = async (StudentID) => {
    try {
        // SQL query to select results for a specific student from the result table
        let sql = 'SELECT * FROM result WHERE StudentID=?';

        // Execute the query and retrieve the result
        const result = await query(sql, [StudentID]);

        // Return the result of the operation
        return result;


    } catch (error) {
        // Handle errors that occurred during the operation
        throw new Error(error);

    }
}

/**
 * Retrieves quiz results for a specific quiz.
 * Queries the result table for entries associated with the given QuizID.
 * @param {number} quizID - ID of the quiz for which results are being retrieved.
 * @returns {Object} - Result of the operation, containing quiz results for the specified quiz.
 */
const getResultsForQuiz = async (quizID) => {
    try {
        // SQL query to select results for a specific quiz from the result table
        const results = await query('SELECT * FROM result WHERE QuizID = ?', [quizID]);

        // Return the result of the operation
        return results;
    } catch (error) {
        // Handle errors that occurred during the operation
        throw new Error(error);
    }
};


/**
 * Updates an existing quiz result with new information.
 * Modifies the result entry in the result table with the specified ResultID.
 * @param {number} ResultID - ID of the result to be updated.
 * @param {number} StudentID - ID of the student associated with the result.
 * @param {number} QuizID - ID of the quiz associated with the result.
 * @param {number} Score - Score achieved by the student in the quiz.
 * @returns {Object} - Result of the operation, indicating the success of the update.
 */
const updateResult = async (ResultID, StudentID, QuizID, Score) => {
    try {
        // SQL query to update an existing result in the result table
        const updateQuery = 'UPDATE result SET StudentID=?, QuizID=?, Score=? WHERE ResultID=?';

        // Execute the update query with the provided parameters
        const result = await query(updateQuery, [StudentID, QuizID, Score, ResultID]);

        // Return the result of the operation
        return result;
    } catch (error) {
        // Handle errors that occurred during the operation
        throw new Error(error);
    }
};

/**
 * Deletes a quiz result based on the provided ResultID.
 * Removes the result entry from the result table.
 * @param {number} resultID - ID of the result to be deleted.
 * @returns {Object} - Result of the operation, indicating the success of the deletion.
 */
const deleteResult = async (resultID) => {
    try {
        // SQL query to delete a result from the result table based on ResultID
        const deleteQuery = 'DELETE FROM result WHERE ResultID = ?';

        // Execute the delete query with the provided ResultID
        const result = await query(deleteQuery, [resultID]);

        // Return the result of the deletion operation
        return result;
    } catch (error) {
        // Handle errors that occurred during the deletion operation
        throw new Error(error);
    }
};

/**
 * Calculates the overall average score for a quiz based on the provided quizID.
 * Retrieves the average score from the result table for the specified quiz.
 * @param {number} quizID - ID of the quiz for which to calculate the overall score.
 * @returns {number} - Overall average score for the quiz. Returns 0 if no results are available.
 */
const calculateOverallScoreForQuiz = async (quizID) => {
    try {
        // SQL query to calculate the overall average score for a quiz from the result table
        const calculateQuery = 'SELECT AVG(Score) AS OverallScore FROM result WHERE QuizID = ?';

        // Execute the query with the provided quizID
        const result = await query(calculateQuery, [quizID]);

        // Retrieve the overall average score from the result, defaulting to 0 if no results are available
        return result[0].OverallScore || 0;
    } catch (error) {
        // Handle errors that occurred during the calculation
        throw new Error(error);
    }
};

// Export the functions for result 
module.exports = {
    createResult
    , getResultsForStudent,
    getResultsForQuiz,
    updateResult,
    deleteResult,
    calculateOverallScoreForQuiz

};