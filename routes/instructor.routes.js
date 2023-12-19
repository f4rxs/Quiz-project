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
    changePasswordController, getInstructorByEmailController, instructorLoginController }
    = require('../controllers/instructor.controller');

const authMiddleware = require('../authentication/middleWare');


// delete route
router.delete('/instruct/:id', deleteInstructorByIdController);
router.get('/instructor-delete/:id', deleteInstructorByIdController);

// put routes
router.put('/instruct/:id', validateUpdateInstructor(), updateInstructorByIDController);
router.put('/instruct-pass/:id', validateUpdatePassword(), changePasswordController);


// post routes
router.post('/instruct', validateRegisterInstructor(), registerInstructorController);
router.post('/instructor-login', instructorLoginController);


// get routes
router.get('/instructors', getAllInstructorsUsernamesController);
router.get('/instruct/:id', getInstructorByIdController);
router.get('/instruct-email/:email', getInstructorByEmailController);


// render routes 
router.get('/login/instructor', (req, res) => {
    res.render('instructor-login', { instructor: { errorMessage: null } });
});

router.get('/sign/instructor', (req, res) => {
    res.render('instructor-signup');
});
router.get('/instructor-page', authMiddleware, (req, res) => {
    const instructor = req.user;
    res.render('instructorPage', { instructor });
});

router.get('/instructor/students', authMiddleware, (req, res) => {
    res.redirect('/students');
});

router.post('/update-instructor/:id', updateInstructorByIDController,(req, res) => {
});

router.post('/update-instructor/pass/:id',changePasswordController,(req,res)=>{    
});


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/quizsystem/login/instructor');
    });
});



module.exports = router;
