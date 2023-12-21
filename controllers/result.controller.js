const { createResult,
    getResultsForStudent, getResultsForQuiz, updateResult, deleteResult, calculateOverallScoreForQuiz } =
    require('../services/result.service');


/**
* Controller for creating a result.
* Validates the input, creates the result, and sends an appropriate response.
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
*/
const createResultController = async (req, res) => {
    try {
        // Destructure the StudentID, QuizID, and Score from the request body
        const { StudentID, QuizID, Score } = req.body;

        // Call the createResult function with the provided parameters
        const result = await createResult(StudentID, QuizID, Score);

        // Check if the result creation was successful
        if (result.affectedRows === 1) {
            // Send a success response if the result was created successfully
            res.status(200).json({ message: "result created successfully." });
        } else {
            // Send an error response if the result creation failed
            res.status(404).json({ message: `Creation faild` });
        }
    } catch (error) {
        // Handle errors that occurred during result creation
        console.error(`An error occured in createResultController`, error);
        res.status(500).json({ message: `An error occured in result creation.` });
    }

};


const getResultsForStudentController = async (req, res) => {
    try {
        const { StudentID } = req.params;

        const results = await getResultsForStudent(StudentID);

        if (results.length > 0) {
            res.render('student-results', { StudentID, results })
            // res.status(200).json(result);

        } else {
            res.status(404).json({ message: `The student with id ${StudentID} is not found` });
        }

    } catch (error) {
        console.error(`An error occurred in getResultsForStudentController:`, error);
        res.status(500).json({ message: 'An error occurred while fetching results.' });
    }
};

/**
 * Controller for getting results for a student.
 * Retrieves results based on the provided student ID and sends them as a response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getResultsForQuizController = async (req, res) => {
    try {
        // Extract the StudentID from the request parameters
        const { quizID } = req.params;

        // Call the getResultsForStudent function with the provided StudentID
        const result = await getResultsForQuiz(quizID);

        // Check if results were found for the student
        if (result.length > 0) {
            // Send a success response with the retrieved results
            // res.status(200).json(result);
            res.render('resultForQuiz', { quizID, result });
        } else {
            // Send a not found response if no results were found for the student
            res.status(404).json({ message: `No results found for the specified quiz with id ${quizID}` });
        }
    } catch (error) {
        // Handle errors that occurred during the process
        console.error('An error occurred in getResultsForQuizController:', error);
        res.status(500).json({ message: 'An error occurred while fetching results for the quiz' });
    }
};

/**
 * Controller for updating a result.
 * Validates the input, updates the result, and sends an appropriate response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const updateResultController = async (req, res) => {
    try {
        // Extract ResultID from the request parameters
        const { ResultID } = req.params;

        // Extract StudentID, QuizID, and Score from the request body
        const { StudentID, QuizID, Score } = req.body;

        // Call the updateResult function with the provided parameters
        const result = await updateResult(ResultID, StudentID, QuizID, Score);

        // Check if the result was successfully updated
        if (result.affectedRows === 1) {
            // Send a success response if the update was successful
            res.status(200).json({ message: 'The result is updated successfully.' });
        } else {
            // Send a not found response if the result with the given ID was not found
            res.status(404).json({ message: `Update failed for the result with ID ${ResultID}` });
        }
    } catch (error) {
        // Handle errors that occurred during the update process
        console.error({ message: 'An error occurred in updateResultController ', error });
        res.status(500).json({ message: 'An error occurred while updating the result' });
    }
};

/**
 * Controller for deleting a result by ID.
 * Deletes the result and sends an appropriate response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const deleteResultController = async (req, res) => {
    try {
        // Extract ResultID from the request parameters
        const { ResultID } = req.params;

        // Call the deleteResult function with the provided ResultID
        const result = await deleteResult(ResultID);

        // Check if the result was successfully deleted
        if (result.affectedRows === 1) {
            // Send a success response if the deletion was successful
            res.status(200).json({ message: 'Result deleted successfully.' });
        } else {
            // Send a not found response if the result with the given ID was not found
            res.status(404).json({ message: `Deletion failed for the result with ID ${ResultID}` });
        }
    } catch (error) {
        // Handle errors that occurred during the deletion process
        console.error({ message: 'An error occurred in deleteResultController', error });
        res.status(500).json({ message: 'An error occurred while deleting the result' });
    }
};

/**
 * Controller for calculating the overall score for a quiz by ID.
 * Retrieves the overall score and sends it as a response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const calculateOverallScoreForQuizController = async (req, res) => {
    try {
        // Extract quizID from the request parameters
        const { quizID } = req.params;

        // Call the calculateOverallScoreForQuiz function with the provided quizID
        const overallScore = await calculateOverallScoreForQuiz(quizID);

        // Send the overall score as a response
        res.status(200).json({ overallScore });
    } catch (error) {

        // Handle errors that occurred during the overall score calculation
        console.error({ message: 'An error occurred in calculateOverallScoreForQuizController', error });
        res.status(500).json({ message: 'An error occurred while calculating the overall score for the quiz' });
    }
};

// Export the controllers 
module.exports = {
    createResultController,
    getResultsForStudentController,
    getResultsForQuizController,
    updateResultController,
    deleteResultController,
    calculateOverallScoreForQuizController
}