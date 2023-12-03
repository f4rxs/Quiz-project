const { query } = require('../database/db');
const bcrypt = require('bcrypt');
/**
 * Register a new instructor.
 * @param {string} username - The username of the new instructor.
 * @param {string} email - The email of the new instructor.
 * @param {string} password - The password of the new instructor.
 * @returns {Object} - An object containing the result of the registration. 
 * If an instructor with the same email or username already exists, it returns an error; 
 * otherwise, it returns the result of the registration.
 */
const registerInstructor = async (username, email, password) => {
  try {
    // Checking  if an instructor with the same email or username exists
    const checkExistingQuery = `SELECT * FROM Instructor WHERE username = ? OR email = ?`;
    const existingInstructor = await query(checkExistingQuery, [username, email]);

    if (existingInstructor.length > 0) {
      // An instructor with the same email or username already exists
      return { error: 'Instructor already registered' };
    } else {
      // If no existing instructor found, proceed to insert the new instructor
      let sql = `INSERT INTO Instructor (username, email, password) VALUES (?, ?, ?)`;
      const result = await query(sql, [username, email, password]);
      return result;
    }
  } catch (error) {
    throw new Error(error);
  }
};

const getInstructorByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM instructor WHERE Email=?';
    const result = await query(sql,[email]);


    return result;

  } catch (error) {
    throw new Error(error);

  }
}
const instructorLoginService = async (email, password) => {
  try {
    const instructor = await getInstructorByEmail(email);


    if (instructor.length > 0) {
      const storedPassword = instructor[0].Password;


      // Compare the entered password with the stored password
      if (password === storedPassword) {
        // Passwords match, return instructor details (excluding the password)
        const { Password, ...instructorDetails } = instructor[0];
        return instructorDetails;
      } else {
        // Incorrect password
        console.log('Incorrect password');
        throw new Error('Incorrect password');
      }
    } else {
      // No instructor found with the specified email
      console.log('Instructor not found');
      throw new Error('Instructor not found');
    }
  } catch (error) {
    console.error(`Login failed: ${error.message}`);
    throw new Error(`Login failed: ${error.message}`);
  }
};



/**
 * Delete an instructor by ID, including associated quizzes (on cascade).
 * @param {int} instructorId - The ID of the instructor to be deleted.
 * @returns {Object} - An object containing the result of the deletion operation.
 */
const deleteInstructorById = async (instructorId) => {
  try {

    // Delete quizzes associated with the instructor
    const deleteQuizzesQuery = 'DELETE FROM quiz WHERE InstructorID = ?';
    await query(deleteQuizzesQuery, [instructorId]);


    // Delete the instructor
    const deleteInstructorQuery = 'DELETE FROM Instructor WHERE InstructorId = ?';
    const result = await query(deleteInstructorQuery, [instructorId]);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};


/**
 * Update an instructor by ID.
 * @param {int} instructorId - The ID of the instructor to be updated.
 * @param {Object} updatedInstructor - A JSON object containing the updated information for the instructor (username, email, password).
 * @returns {Object} - An object containing the result of the update.
 */
const updateInstructorByID = async (instructorId, updatedInstructor) => {
  const { username, email, password } = updatedInstructor;

  try {
    // Check if the new email or username is already registered
    const checkExistingQuery = `SELECT * FROM instructor WHERE (Username = ? OR Email = ?) AND InstructorId != ?`;
    const existingInstructor = await query(checkExistingQuery, [username, email, instructorId]);

    if (existingInstructor.length > 0) {
      // An instructor with the same email or username already exists
      return { error: 'The updated instructor is already registered' };
    }

    // If no existing instructor found, proceed to update the instructor
    let sql = `UPDATE instructor SET Username=?, Email=?, Password=? WHERE InstructorId=?`;
    const result = await query(sql, [username, email, password, instructorId]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


/**
 * Get all usernames of instructors.
 * @returns {Object} - An object containing an array of usernames for all instructors.
 */
const getAllInstructorsUsernames = async () => {
  const result = await query('SELECT Username FROM instructor');

  return result;

};

/**
 * Get instructor information by ID.
 * @param {int} instructorID - The ID of the instructor to retrieve.
 * @returns {Object} - An object containing the information of the instructor with the specified ID.
 */
const getInstructorById = async (instructorID) => {
  try {
    const sql = 'SELECT * FROM instructor WHERE InstructorID = ?';
    const result = await query(sql, [instructorID]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


/**
 * Change the password for a given instructor.
 * @param {int} instructorID - The ID of the instructor whose password needs to be changed.
 * @param {string} newPassword - The new password to be set.
 * @returns {Object} - An object containing a message about the success or failure of the password change.
 */
const changeInstructorPassword = async (instructorID, newPassword) => {
  try {
    if (!instructorID || !newPassword) {
      // Check if either instructorID or newPassword is missing
      return { message: 'Invalid input - Instructor ID and new password are required' };
    }

    // SQL query to update the password in the 'instructor' table
    const sql = 'UPDATE instructor SET Password = ? WHERE InstructorID = ?';

    // Execute the SQL query with the provided parameters
    const result = await query(sql, [newPassword, instructorID]);

    // Check the number of affected rows to determine the success of the update
    if (result.affectedRows === 1) {
      return { message: 'Password changed successfully' };
    } else {
      return { message: `Password change failed - Instructor with id ${instructorID} not found` };
    }
  } catch (error) {
    // If an error occurs during the execution of the function, throw an error
    throw new Error(error);
  }
};


/**
 * Instructors Module
 * This module provides functions for managing instructors in a system.
 * It includes functionality for registration, deletion, updating, and retrieval of instructor information.
 * Additionally, there is a function for changing an instructor's password.
 *
 * @module instructors
 * @exports registerInstructor
 * @exports deleteInstructorById
 * @exports updateInstructorByID
 * @exports getAllInstructorsUsernames
 * @exports getInstructorById
 * @exports changeInstructorPassword
 */
module.exports = {
  registerInstructor,
  deleteInstructorById,
  updateInstructorByID,
  getAllInstructorsUsernames,
  getInstructorById,
  changeInstructorPassword,
  getInstructorByEmail,
  instructorLoginService
};
