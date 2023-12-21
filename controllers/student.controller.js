const { validationResult } = require('express-validator');
const { registerStudent,
    getStudentById,
    getAllStudentsUserNames,
    deleteStudentById,
    updateStudentById,
    changeStudentPassword, getAllStudents,
     getStudentByEmail, studentLoginService } = require('../services/student.service');
     
const { validateRegisterStudent,
    validateUpdateStudent } = require('../validaters/student.validator');

const { getQuizByID, getQuestionsForQuiz, getQuestionsWithChoicesOfAQuiz } = require('../services/quiz.service');
const { getChoicesByQuizId } = require('../services/choices.service');
const { createResult, calculateQuizScoreService } = require('../services/result.service');

const { generateToken } = require('../authentication/authn');
const session = require('express-session');
const { message } = require('statuses');

/**
 * Get a student by ID.
 *
 * This controller function handles the HTTP request to retrieve a student's information based on the provided student ID.
 * It calls the appropriate service function to fetch the student data from the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing the student information if found, or an error message if not found.
 *
 */
const getStudentByIDController = async (req, res) => {
    // Extract the student ID from the request parameters
    const { id } = req.params;

    try {
        // Call the service function to get the student information by ID
        const student = await getStudentById(id);

        // Check if the student is found
        if (student.length > 0) {
            // Send a 200 OK response with the student information
            res.status(200).json(student);
        } else {
            // Send a 404 Not Found response with an error message
            res.status(404).json({ message: `The student with id ${id} is not found` });
        }
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error("An error occurred in getStudentByIDController ", error);
        res.status(500).json({ message: 'An error occurred while fetching for the students' });
    }
}


/**
 * Get usernames of all students.
 *
 * This controller function handles the HTTP request to retrieve usernames of all students.
 * It calls the appropriate service function to fetch the usernames from the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing an array of student usernames if found,
 * or a 404 Not Found response with an error message if no students are found.
 *
 */
const getAllStudentsUserNamesController = async (req, res) => {
    try {
        // Call the service function to get usernames of all students
        const students = await getAllStudentsUserNames();

        // Check if any students are found
        if (students.length > 0) {
            // Send a 200 OK response with the array of student usernames
            res.status(200).json(students);
        } else {
            // Send a 404 Not Found response with an error message
            res.status(404).json({ message: 'No students found' });
        }
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error('An error occurred in getAllStudentsUserNameController ', error);
        res.status(500).json({ message: 'An error occurred while fetching for the students' });
    }
}


/**
 * Register a new student.
 *
 * This controller function handles the HTTP request to register a new student.
 * It performs input validation using the provided express-validator middleware.
 * It calls the appropriate service function to register the student in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the registration is successful,
 * or an error message if the registration fails (e.g., student already registered, registration failed).
 *
 */
const registerStudentController = async (req, res) => {
    try {
        // Validate the request using express-validator
        const errors = validationResult(req);

        // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        // Extract username, email, and password from the request body
        const { username, email, password } = req.body;

        // Call the service function to register the student
        const result = await registerStudent(username, email, password);

        // Check the result and send the appropriate response
        if (result.error === 'The student is already registered') {
            // Send a 400  Found response with an error message
            res.status(409).json({ message: 'The student is already registered' });
        } else if (result.affectedRows === 1) {

            // Send a 200 OK response with a success message
            // res.status(200).json({ message: 'Student registered successfully' });
            res.render('student-login');

        } else {

            // send a 500 response with a fail message
            res.status(500).json({ message: 'Student registration failed ' });
        }
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error("An error occurred in registerStudentController ", error);
        res.status(500).json({ message: 'An error occurred during registration' });
    }
};

/**
 * Delete a student by ID.
 *
 * This controller function handles the HTTP request to delete a student based on the provided student ID.
 * It calls the appropriate service function to delete the student from the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the deletion is successful,
 * or a 404 Not Found response with an error message if the student is not found.
 *
 */
const deleteStudentByIdController = async (req, res) => {
    // Extract the student ID from the request parameters
    const { studentID } = req.params;

    try {
        // Call the service function to delete the student by ID
        const result = await deleteStudentById(studentID);

        // Check if the student is found and deleted
        if (result.affectedRows === 1) {

            // Send a 200 OK response with a success message
            // res.status(200).json({ message: 'Student deleted successfully.' });
            res.redirect('/quizsystem/login/student');
        } else {

            // Send a 404 Not Found response with an error message
            res.status(404).json({ message: `The student with id ${studentID} is not found` });

        }
    } catch (error) {
        console.error({ message: 'an error occured in deleteStudentByIdController', error });
        res.status(500).json({ message: 'An error occured during deletion' });

    }

}

/**
 * Update a student by ID.
 *
 * This controller function handles the HTTP request to update a student based on the provided student ID.
 * It performs input validation using the provided express-validator middleware.
 * It calls the appropriate service function to update the student in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the update is successful,
 * a 404 Not Found response with an error message if the student is not found,
 * or a 400 Bad Request response with validation errors if input validation fails.
 *
 */
const updateStudentByIdController = async (req, res) => {
    // Extract student ID from the request parameters
    const studentID = req.params.id;

    // Extract username, email, and password from the request body
    const { username, email, password } = req.body;

    try {
        // Validate the request using express-validator
        const errors = validationResult(req);

        // Check for validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Call the service function to update the student by ID
        const result = await updateStudentById(studentID, { username, email, password });

        // Check the result and send the appropriate response
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        if (result.affectedRows > 0) {
            // res.render('getStudents', { studentID: studentID }, { message: 'Student updated successfully.' });
            res.redirect('/quizsystem/login/student');

            // res.status(200).json({ message: 'Student updated successfully.' });
        } else {
            res.status(404).json({ message: `Student with ID ${studentID} not found.` });
        }
    } catch (error) {

        // Log the error and send a 500 Internal Server Error response with an error message
        console.error('An error occurred in updateStudentByIdController:', error);
        res.status(500).json({ message: 'An error occurred during the update.' });
    }
};



/**
 * Change the password of a student by ID.
 *
 * This controller function handles the HTTP request to change the password of a student based on the provided student ID.
 * It performs input validation using the provided express-validator middleware.
 * It calls the appropriate service function to update the student's password in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the password change is successful,
 * a 404 Not Found response with an error message if the student is not found,
 * or a 400 Bad Request response with validation errors if input validation fails.
 *
 */
const changeStudentPasswordController = async (req, res) => {
    // Validate the request using express-validator
    const errors = validationResult(req);


    // Check for validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract student ID and new password from the request parameters and body
    const { id } = req.params;
    const { newPassword } = req.body;


    try {

        // Call the service function to change the student's password
        const result = await changeStudentPassword(id, newPassword);

        // Check the result and send the appropriate response
        if (result.message === 'Password changed successfully') {
            res.redirect('/quizsystem/login/student');
            // res.status(200).json({ message: 'Password changed successfully' });
        } else {
            res.status(404).json({ message: `student with ID ${id} not found - Password change failed` });
        }
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error('Error in changeStudentPasswordController:', error);
        res.status(500).json({ message: 'An error occurred during password change' });
    }
};


const getAllStudentsController = async (req, res) => {

    try {
        const students = await getAllStudents();
        if (students.length > 0) {

            res.render('getStudents', { students });
        } else {
            res.status(404).json({ message: 'No students found' });
        }

    } catch (error) {
        console.error("An error occurred in getAllStudentsController", error);
        res.status(500).json({ message: 'An error occurred while fetching students' });
    }
};



const getStudentByEmailController = async (req, res) => {
    const { email } = req.params;

    try {
        const student = await getStudentByEmail(email);
        if (student.length > 0) {
            res.status(200).json(student);

        } else {
            res.status(404).json({ message: "Student not found" });

        }
    } catch (error) {
        console.error("An error occured in getStudentByEmailController", error);
        res.status(500).json({ message: "an error occured during fetching" });
    }
}

const studentLoginController = async (req, res) => {
    const { email, password } = req.body;

    try {

        const studentDetails = await studentLoginService(email, password);
        if (studentDetails) {
            const token = generateToken({ userId: studentDetails.studentID, role: 'student' });
            req.session.studentID = studentDetails.studentID;
            req.session.user = {
                studentID: studentDetails.studentID,
                role: 'student'
            };

            req.session.save(err => {
                if (err) {
                    console.error(`Error saving session: ${err.message}`);
                    res.status(500).send('Internal server error');
                } else {
                    res.render("studentPage", { student: studentDetails, token });
                }
            });
        } else {
            const errorMessage = 'Invalid email or password';

            // Render the studentPage template with an error message
            res.render("studentPage", { student: { studentDetails: { StudentID: null }, errorMessage } });

        }
    } catch (error) {
        console.error(`Student login failed: ${error.message}`);
        res.status(401).json({ message: 'Login failed', error: error.message });
    }
};


const takeQuizController = async (req, res) => {
    try {
        const { studentID, quizID } = req.body;


        // Call the getQuizByID function to retrieve the quiz by ID
        const quiz = await getQuizByID(quizID);

        // Check if quizzes were found for the provided QuizID
        if (quiz.length > 0) {
            // Retrieve questions for the specified quiz
            const questions = await getQuestionsForQuiz(quizID);

            // Check if questions were found
            if (questions.length > 0) {

                const choices = await getChoicesByQuizId(quizID);

                if (choices.length > 0)
                    res.render('take-quiz', { quiz, questions, choices, studentID, quizID });
            } else {
                // No questions found for the given Quiz ID
                res.status(404).json({ message: `No question found for the given Quiz ID ${quizID}` });
            }
        } else {
            // If no quizzes were found, return a 404 Not Found response
            res.status(404).json({ message: `Invalid quiz ID -> ${quizID}` });
        }
    } catch (error) {
        // Log and send a 500 Internal Server Error response in case of an error
        console.error('Error in takeQuizController', error);
        res.status(500).json({ message: 'An error occurred during taking the quiz' });
    }
};

const submitQuizController = async (req, res) => {
    try {

        const { studentID, quizID, ...selectedChoices } = req.body;

        // Retrieve correct choices for each question
        const questions = await getQuestionsWithChoicesOfAQuiz(quizID);

        // Calculate quiz score using the service
        const Score = await calculateQuizScoreService(quizID, selectedChoices, questions);

        // Save the result in the database
        const result = await createResult(studentID, quizID, Score);

        res.render('quiz-submission-success', { Score, totalQuestions: questions.length });

    } catch (error) {
        console.error('An error occurred in submitQuizController: ', error);
        res.status(500).json({ message: 'An error occurred while submitting the quiz' });
    }
};





// Export the controller function for use in routes
module.exports = {
    getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController,
    getAllStudentsController,
    getStudentByEmailController,
    studentLoginController,
    takeQuizController,
    submitQuizController
};
