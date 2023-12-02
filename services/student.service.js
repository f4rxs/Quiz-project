const { retry } = require('statuses');
const { query } = require('../database/db');




/**
 * Register a new student.
 * @param {string} Username - The username of the new student.
 * @param {string} Email - The email of the new student.
 * @param {string} Password - The password of the new student.
 * @returns {Object} - An object containing the result of the registration. 
 * If a student with the same username already exists, it returns an error; 
 * otherwise, it returns the result of the registration.
 */
const registerStudent = async (Username, Email, Password) => {
    try {
        // Check if a student with the provided username already exists
        const checkExistingQuery = 'SELECT * FROM student WHERE Username=?';
        const existingStudent = await query(checkExistingQuery, [Username]);

        // If a student with the same username exists, return an error
        if (existingStudent.length > 0) {
            return { error: 'The student is already registered' };
        } else {
            // Insert the new student into the database
            let sql = 'INSERT INTO student(Username, Email, Password) VALUES (?, ?, ?)';
            const result = await query(sql, [Username, Email, Password]);
            return result;
        }
    } catch (error) {
        // Throw an error if an unexpected issue occurs during the registration process
        throw new Error(error);
    }
};

/**
 * Delete a student by ID.
 * @param {int} studentID - The ID of the student to be deleted.
 * @returns {Object} - An object containing the result of the deletion operation.
 */
const deleteStudentById = async (studentID) => {
    try {
        // Delete the student from the database based on the provided student ID
        const deleteStudentQuery = 'DELETE FROM student WHERE StudentID=?';
        const result = await query(deleteStudentQuery, [studentID]);
        return result;


    } catch (error) {
        // Throw an error if an unexpected issue occurs during the deletion process
        throw new Error(error);

    }
}

/**
 * Get a student by ID.
 * @param {int} studentID - The ID of the student to retrieve.
 * @returns {Object} - An object containing the information of the student with the specified ID.
 */
const getStudentById = async (studentID) => {
    try {

        const sql = 'SELECT * FROM student WHERE studentID=?';
        const result = await query(sql, [studentID]);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

/**
 * Get usernames of all students.
 * @returns {Object} - An object containing an array of usernames for all students.
 */
const getAllStudentsUserNames = async () => {
    try {

        // Select every student's username
        const sql = 'SELECT Username FROM student';

        return await query(sql);
    } catch (error) {
        // Throw an error if an unexpected issue occurs during the deletion process
        throw new Error(error);

    }
}

/**
 * Update a student by ID.
 * @param {int} StudentID - The ID of the student to be updated.
 * @param {Object} updatedStudent - A JSON object containing the updated information for the student (username, email, password).
 * @returns {Object} - An object containing the result of the update.
 */
const updateStudentById = async (StudentID, updatedStudent) => {
    const { username, email, password } = updatedStudent;

    try {
        // Check if the updated username or email is already registered for another student
        const checkExistingQuery = 'SELECT * FROM student WHERE (Username = ? OR Email = ?) AND StudentID != ?';
        const existingStudent = await query(checkExistingQuery, [username, email, password]);

        // If the updated username or email is already registered, return an error
        if (existingStudent.length > 0) {
            return { error: 'The updated student is already registered.' };

        }
        // Update the student information in the database based on the provided student ID
        let sql = 'UPDATE student SET Username=?,Email=?,Password=? WHERE StudentID=?';
        const result = await query(sql, [username, email, password, StudentID]);

        return result;

    } catch (error) {
        // Throw an error if an unexpected issue occurs during the update process
        throw new Error(error);

    }
};

/**
 * Change a student's password.
 * @param {int} StudentID - The ID of the student to change the password.
 * @param {string} newPassword - The new password for the student.
 * @returns {Object} - An object containing the result of the password change operation.
 */
const changeStudentPassword = async (StudentID, newPassword) => {
    try {
        // Update the password of the student in the database based on the provided student ID
        const sql = 'UPDATE Student SET Password=? WHERE StudentID=?';
        const result = await query(sql, [newPassword, StudentID]);

        // If the password change operation is successful, return a success message
        if (result.affectedRows === 1) {
            return { message: 'Password changed successfully' };
        } else {
            // If the student with the provided ID is not found, return an error message
            return { message: `Invalid input, student with ID ${id} not found` };
        }
    } catch (error) {
        //throw an error if an unexpected issue occurs during the password change process
        throw new Error('An error occurred during password change');
    }
};


/**
 * Exports the student service functions.
 */
module.exports = {
    registerStudent,
    getAllStudentsUserNames,
    getStudentById,
    deleteStudentById,
    updateStudentById,
    changeStudentPassword
};
