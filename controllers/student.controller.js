const { validationResult } = require('express-validator');
const { registerStudent,
    getStudentById,
    getAllStudentsUserNames,
    deleteStudentById,
    updateStudentById,
    changeStudentPassword, getAllStudents } = require('../services/student.service');
const { validateRegisterStudent,
    validateUpdateStudent } = require('../validaters/student.validator');

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
            res.status(200).json({ message: 'Student registered successfully' });
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
    const { id } = req.params;

    try {
        // Call the service function to delete the student by ID
        const result = await deleteStudentById(id);

        // Check if the student is found and deleted
        if (result.affectedRows === 1) {

            // Send a 200 OK response with a success message
            res.status(200).json({ message: 'Student deleted successfully.' });
        } else {

            // Send a 404 Not Found response with an error message
            res.status(404).json({ message: `The student with id ${id} is not found` });

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
            res.status(200).json({ message: 'Student updated successfully.' });
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
            res.status(200).json({ message: 'Password changed successfully' });
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
            res.render('getStudents', {students});

            // res.status(200).json(students);

        } else {
            res.status(404).json({ message: 'No students found' });

        }


    } catch (error) {
        console.error("an erro occured in getAllstudentsController", error);
        res.status(500).json({ message: 'an error occured while fetching for the students' });
    }
}


// Export the controller function for use in routes
module.exports = {
    getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController,
    getAllStudentsController
};
