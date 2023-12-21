const { registerInstructor,
  deleteInstructorById,
  updateInstructorByID,
  getAllInstructorsUsernames,
  getInstructorById,
  changeInstructorPassword, getInstructorByEmail, instructorLoginService } = require('../services/instructor.service');
const { validationResult } = require('express-validator');
const { validateRegisterInstructor,
  validateUpdateInstructor,
  validateUpdatePassword } = require('../validaters/instructorValidator');
const { message } = require('statuses');

const { generateToken } = require('../authentication/authn');

/**
 * Controller for registering a new instructor.
 *
 * This controller function handles the HTTP request to register a new instructor.
 * It performs input validation using the provided express-validator middleware.
 * It calls the appropriate service function to register the instructor in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the instructor registration is successful,
 * a 400 Bad Request response with validation errors if input validation fails,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during registration.
 */
const registerInstructorController = async (req, res) => {
  try {
    // Validate the request using express-validator
    const errors = validationResult(req);

    // Check for validation errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract username, email, and password from the request body
    const { username, email, password } = req.body;

    // Call the service function to register the instructor
    const result = await registerInstructor(username, email, password);

    // Check the result and send the appropriate response
    if (result.error === 'Instructor already registered') {
      res.status(400).json({ message: 'Instructor is already registered' });
    } else if (result.affectedRows === 1) {
      // Use res.redirect instead of res.status(200).json
    } else {
      res.redirect('/quizsystem/login/instructor');

    }
  } catch (error) {
    console.error('Error in registerInstructorController:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
};




/**
 * Controller for deleting an instructor by ID.
 *
 * This controller function handles the HTTP request to delete an instructor based on the provided instructor ID.
 * It calls the appropriate service function to delete the instructor from the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the instructor deletion is successful,
 * a 404 Not Found response with an error message if the instructor is not found,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during deletion.
 *
 */


const deleteInstructorByIdController = async (req, res) => {
  const id = req.params.id;

  try {

    // Call the service function to delete the instructor
    const result = await deleteInstructorById(id);

    if (result.affectedRows === 1) {
      // res.status(200).json({ message: 'Instructor deleted successfully' });
      res.redirect('/quizsystem/login/instructor');
    } else {
      res.status(404).json({ message: `Invalid ID ${id}  - Instructor is not found ` });
    }
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response with an error message
    console.error('Error in deleteInstructorByIdController:', error);
    res.status(500).json({ message: 'An error occurred during deletion' });
  }
};



/**
 * Controller for updating an instructor by ID.
 *
 * This controller function handles the HTTP request to update an instructor based on the provided instructor ID.
 * It performs input validation using the provided express-validator middleware.
 * It calls the appropriate service function to update the instructor in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing a success message if the instructor update is successful,
 * a 400 Bad Request response with validation errors if input validation fails,
 * a 404 Not Found response if the instructor is not found,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during update.
 */
const updateInstructorByIDController = async (req, res) => {
  const id = req.params.id;
  const errors = validationResult(req);


  // Check for validation errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract username, email, and password from the request body
  const { username, email, password } = req.body;

  try {
    // Create an object with the updated instructor details
    const updatedInstructor = {
      username,
      email,
      password,
    };
    // Call the service function to update the instructor
    const instructorDetails = await updateInstructorByID(id, updatedInstructor);

    // Check the instructorDetails and send the appropriate response
    if (instructorDetails.error) {
      return res.render('instructorPage', { error: instructorDetails.error });
    }

    if (instructorDetails.affectedRows === 1) {

      res.redirect('/quizsystem/login/instructor');
      // res.status(200).json({ message: 'Instructor updated successfully' });
    } else {
      // return res.render('instructorPage', { error: `Invalid ID ${id} - Instructor is not available to update` });
    }
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response with an error message
    console.error('Error in updateInstructorByIDController:', error);
    res.status(500).json({ message: 'An error occurred during update' });
  }
};



/**
 * Controller for retrieving usernames of all instructors.
 *
 * This controller function handles the HTTP request to fetch usernames of all instructors from the database.
 * It calls the appropriate service function to retrieve the usernames.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing an array of instructor usernames if instructors are found,
 * a 404 Not Found response with a message if no instructors are found,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during retrieval.
 */
const getAllInstructorsUsernamesController = async (req, res) => {
  try {
    // Call the service function to retrieve usernames of all instructors
    const instructors = await getAllInstructorsUsernames();

    // Check if instructors are found and send the appropriate response
    if (instructors.length > 0) {
      res.status(200).json(instructors);

    }
    else {
      res.status(400).json({ message: `No instrutor found.` });

    }
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response with an error message
    console.error(`Error in getAllInstructorsUsernamesController`, error);
    res.status(500).json({ message: `An error occured while geting instructors.` });
  }
};


/**
 * Controller for retrieving an instructor by ID.
 *
 * This controller function handles the HTTP request to fetch information about an instructor based on their ID.
 * It calls the appropriate service function to retrieve the instructor information.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response containing instructor information if the instructor is found,
 * a 404 Not Found response with a message if no instructor is found with the provided ID,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during retrieval.
 *
 */
const getInstructorByIdController = async (req, res) => {
  const { id } = req.params;

  try {

    // Call the service function to retrieve information about the instructor by ID
    const instructor = await getInstructorById(id);

    // Check if an instructor is found and send the appropriate response
    // res.render('getInstructorById', { instructor, id });

    if (instructor.length > 0) {
      res.status(200).json(instructor);
    } else {
      res.status(404).json({ message: `No instructor found with the  ID ${id}.` });
    }
  } catch (error) {
    // Log the error and send a 500 Internal Server Error response with an error message
    console.error('Error in getInstructorByIdController:', error);
    res.status(500).json({ message: 'An error occurred during fetching instructor.' });
  }
};


/**
 * Controller for changing an instructor's password.
 *
 * This controller function handles the HTTP request to change the password of an instructor.
 * It validates the input, calls the appropriate service function to update the password,
 * and sends the appropriate response based on the result.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {Object} - The HTTP response indicating whether the password change was successful or not.
 * If successful, it returns a 200 OK response with a success message.
 * If the instructor is not found, it returns a 404 Not Found response with a message.
 * If there are validation errors in the input, it returns a 400 Bad Request response with error details.
 * If an unexpected issue occurs during the password change process, it returns a 500 Internal Server Error response.
 *
 */
const changePasswordController = async (req, res) => {
  const errors = validationResult(req);

  // Check for validation errors in the input
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { newPassword } = req.body;
  try {

    // Call the service function to change the instructor's password
    const result = await changeInstructorPassword(id, newPassword);

    if (result.message === 'Password changed successfully') {
      res.redirect('/quizsystem/login/instructor');
      // res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(404).json({ message: `Instructor with ID ${id} not found - Password change failed` });
    }
  } catch (error) {
    // Check the result and send the appropriate response
    console.error('Error in changePasswordController: ', error);
    res.status(500).json({ message: 'An error occurred during password change' });
  }
};

const getInstructorByEmailController = async (req, res) => {
  const { email } = req.params;

  try {
    const instructor = await getInstructorByEmail(email);
    if (instructor.length > 0) {
      res.status(200).json(instructor);

    } else {
      res.status(400).json({ message: `instructor with email ${email} is not found` });

    }


  } catch (error) {
    console.error('An error occured in getInstructorByEmailController', error);
    res.status(500).json({ message: 'an error occured during fetching for the instrucotr' });

  }
}

const instructorLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const instructorDetails = await instructorLoginService(email, password);

    if (instructorDetails) {
      const token = generateToken({ userId: instructorDetails.instructorDetails.InstructorID, role: 'instructor' });

      req.session.instructorID = instructorDetails.instructorDetails.InstructorID;

      req.session.save(err => {
        if (err) {
          console.error(`Error saving session: ${err.message}`);
          return res.status(500).send('Internal Server Error');
        }

        res.render('instructorPage', { instructorDetails, token });
      });
    } else {
      const errorMessage = 'Invalid email or password';
      res.render('instructor-login', { instructor: { errorMessage } });
    }
  } catch (error) {
    console.error(`Instructor login failed: ${error.message}`);
    const errorMessage = 'Invalid email or password';
    res.render('instructor-login', { instructor: { errorMessage } });
  }
};





// Export the controller function for use in routes
module.exports = {
  registerInstructorController,
  deleteInstructorByIdController,
  updateInstructorByIDController,
  getAllInstructorsUsernamesController,
  getInstructorByIdController,
  changePasswordController,
  getInstructorByEmailController,
  instructorLoginController
};
