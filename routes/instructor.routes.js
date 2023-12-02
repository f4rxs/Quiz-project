const express = require('express');
const router = express.Router();

const { validateRegisterInstructor,
    validateUpdateInstructor,
    validateUpdatePassword } =
    require('../validaters/instructorValidator');

const { registerInstructorController,
    deleteInstructorByIdController,
    updateInstructorByIDController,
    getAllInstructorsUsernamesController,
    getInstructorByIdController,
    changePasswordController, getInstructorByEmailController,instructorLoginController }
    = require('../controllers/instructor.controller');




// delete route
router.delete('/instruct/:id', deleteInstructorByIdController);

// put routes
router.put('/instruct/:id', validateUpdateInstructor(), updateInstructorByIDController);
router.put('/instruct-pass/:id', validateUpdatePassword(), changePasswordController);


// post routes
router.post('/instruct', validateRegisterInstructor(), registerInstructorController);
router.post('/instructor-login', instructorLoginController);
// router.post('/instructor-login');

// get routes
router.get('/instructors', getAllInstructorsUsernamesController);
router.get('/instruct/:id', getInstructorByIdController);
router.get('/instruct-email/:email', getInstructorByEmailController);
router.get('/login/instructor', (req, res) => {
    res.render('instructor-login');
});
router.get('/sign/instructor',(req,res)=>{
    res.render('instructor-signup.ejs');
});

module.exports = router;
