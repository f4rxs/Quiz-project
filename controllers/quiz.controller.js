
const { query } = require('../database/db');

const { json } = require("body-parser");
const { createQuiz,
    getQuizByID,
    listQuizzes,
    getQuizzesByInstructorID,
    updateQuiz,
    deleteQuizById,
    getQuestionsForQuiz,
    getQuestionsWithChoicesOfAQuiz } = require(`../services/quiz.service`);



/**
* Controller for creating a new quiz.
* Validates the input, checks the existence of the instructor,
* creates the quiz, and sends an appropriate response.
*
* @param {Object} req - Express request object containing the quiz details in the request body.
* @param {Object} res - Express response object for sending the response.
*/
const createQuizController = async (req, res) => {
    const { instructorID, title, description, timeLimit } = req.body;

    try {
        // Check the existence of the instructor with the provided ID
        const checkInstructorQuery = 'SELECT * FROM instructor WHERE InstructorID = ?';
        const instructorResult = await query(checkInstructorQuery, [instructorID]);

        // If the instructor does not exist, return a 400 Bad Request response
        if (instructorResult.length === 0) {
            return res.status(400).json({ message: `Instructor with ID ${instructorID} does not exist.` });
        }

        // Create a quiz object with the provided details
        const quiz = { instructorID, title, description, timeLimit };

        // Call the createQuiz function to add the quiz to the database
        const result = await createQuiz(quiz);

        // Check the affected rows to determine the success of quiz creation
        if (result.affectedRows === 1) {
            req.session.quizID = result.insertId;
            res.redirect(`/quizsystem/my-quizzes/${instructorID}`);
            // res.status(200).json({ message: 'Quiz created successfully' });
        } else {
            res.status(500).json({ message: 'Quiz creation failed' });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in createQuizController:', error);
        res.status(500).json({ message: 'An error occurred during quiz creation' });
    }
};

/**
 * Controller for submitting a quiz.
 * Validates the input, submits the quiz, and redirects to view results.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const submitQuizController = async (req, res) => {
    const { studentID, quizID, answers } = req.body;

    try {
        // Assuming you have a service function to handle quiz submission
        const result = await submitQuiz(studentID, quizID, answers);

        if (result.success) {
            // Redirect to the quiz results page after successful submission
            res.redirect(`/quiz-system/quiz-results/${quizID}`);
        } else {
            res.status(400).json({ message: 'Quiz submission failed' });
        }
    } catch (error) {
        console.error('Error in submitQuizController:', error);
        res.status(500).json({ message: 'An error occurred during quiz submission' });
    }
};


/**
 * Controller for retrieving a quiz by ID.
 * Retrieves the quiz information based on the provided QuizID and sends it as a response.
 *
 * @param {Object} req - Express request object containing the QuizID in the request parameters.
 * @param {Object} res - Express response object for sending the response.
 */
const getQuizByIDController = async (req, res) => {
    const { QuizID } = req.params;
    try {
        // Call the getQuizByID function to retrieve the quiz by ID
        const quizzes = await getQuizByID(QuizID);

        // Check if quizzes were found for the provided QuizID
        if (quizzes.length > 0) {
            res.status(200).json(quizzes);
        } else {
            // If no quizzes were found, return a 400 Bad Request response
            res.status(400).json({ message: `Invalid quiz ID -> ${QuizID}` });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in getQuizByIDController', error);
        res.status(500).json({ message: 'An error occurred during getting the quizzes' });
    }
};

/**
 * Controller for retrieving a list of all quizzes.
 * Retrieves all quizzes from the database and sends them as a response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending the response.
 */
const listQuizzesController = async (req, res) => {
    try {
        // Call the listQuizzes function to retrieve the list of all quizzes
        const quizess = await listQuizzes();

        // Check if quizzes were found
        if (quizess.length > 0) {
            res.render('Quizzes', { quizess });

        } else {
            // If no quizzes were found, return a 400 Bad Request response
            res.status(400).json({ message: 'No quizzes found' });

        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        res.status(500).json({ message: 'An error occurred during getting the quizzess' });


    }

};

/**
 * Controller for retrieving quizzes by instructor ID.
 * Retrieves quizzes associated with a specific instructor from the database and sends them as a response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending the response.
 */
const getQuizzesByInstructorIDController = async (req, res) => {
    // Extract instructorID from request parameters
    const { instructorID } = req.params;

    try {
        // Call the getQuizzesByInstructorID function to retrieve quizzes for the specified instructor
        const quizzes = await getQuizzesByInstructorID(instructorID);

        // Check if quizzes were found
        if (quizzes.length > 0) {
            res.render('instructor-quizzes', { quizzes });
        } else {
            // If no quizzes were found, return a 404 Not Found response
            res.status(404).json({ message: `No quizzes found for this instructor with the id ${instructorID}` });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in getQuizzesByInstructorIDController:', error);
        res.status(500).json({ message: 'An error occurred while retrieving quizzes' });
    }
};


/**
 * Controller for updating a quiz by ID.
 * Validates the input, updates the quiz, and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending the response.
 */
const updatedQuizController = async (req, res) => {
    // Extract QuizID from request parameters and Title, Description, TimeLimit from request body
    const { QuizID } = req.params;
    const { Title, Description, TimeLimit } = req.body;

    try {
        // Create an object with the updated quiz information
        const updatedQuiz = {
            Title,
            Description,
            TimeLimit
        };

        // Call the updateQuiz function to update the quiz in the database
        const result = await updateQuiz(QuizID, updatedQuiz);

        if (result.message) {

            res.status(400).json({ message: `invalid quiz id ${QuizID}` });
        } else {
            // If no message is present, the quiz was updated successfully
            res.status(200).json({ message: "Quiz updated successfully" });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in updatedQuizController:', error);
        res.status(500).json({ message: 'An error occurred during quiz update' });
    }
};


/**
 * Controller for deleting a quiz by ID.
 * Deletes the quiz and sends an appropriate response.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object for sending the response.
 */
const deleteQuizByIdController = async (req, res) => {
    // Extract QuizID from request parameters
    const { QuizID } = req.params;

    try {
        // Call the deleteQuizById function to delete the quiz from the database
        const result = await deleteQuizById(QuizID);
        const instructorID = req.session.instructorID;
        // Check if no rows were affected, indicating no quiz was found with the given ID
        if (result.affectedRows === 0) {
            res.status(404).json({ message: `No quiz found with the provided ID->${QuizID} ` });

        } else {
            // If at least one row was affected, the quiz was deleted successfully
            res.redirect(`/quizsystem/my-quizzes/${instructorID}`);

            // res.status(200).json({ message: 'Quiz deleted successfully' });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in deleteQuizByIdController', error);
        res.status(500).json({ message: 'An error occurred during quiz deletion' });
    }
};


/**
 * Controller for getting questions for a quiz by QuizID.
 * Retrieves questions for the specified quiz and sends them as a response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getQuestionsForQuizController = async (req, res) => {
    const { QuizID } = req.params;
    try {
        // Retrieve questions for the specified quiz
        const questtions = await getQuestionsForQuiz(QuizID);

        // Check if questions were found
        if (questtions.length > 0) {
            res.render('questions-quiz', { questtions, quizID: QuizID });
            // res.status(200).json({ questtions });
        }
        else {
            // No questions found for the given Quiz ID
            res.status(404).json({ message: `No question found for the given Quiz ID ${QuizID}` });

        }

    } catch (error) {
        // Handle errors that occurred during the operation
        console.error('An error occured in the getQuestionsForQuizController:', error);
        res.status(500).json({ message: 'An error occured while getting the questions  ' });
    }
};




const getQuestionsWithChoicesOfAQuizController = async (req, res) => {
    try {
        const { quizID } = req.params;

        // Call the service to get questions with choices for the specified quiz
        const result = await getQuestionsWithChoicesOfAQuiz(quizID);

        // Check if any data was retrieved
        if (result.length > 0) {
            // If data is found, send it as a response
            res.status(200).json(result);
        } else {
            // If no data is found, send a 404 Not Found response
            res.status(404).json({ message: 'No questions with choices found for the specified quiz' });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('An error occurred in getQuestionsWithChoicesOfAQuizController:', error);
        res.status(500).json({ message: 'An error occurred while fetching questions with choices' });
    }
};




module.exports = {
    createQuizController,
    getQuizByIDController,
    listQuizzesController,
    getQuizzesByInstructorIDController,
    updatedQuizController,
    deleteQuizByIdController,
    getQuestionsForQuizController,
    getQuestionsWithChoicesOfAQuizController
}