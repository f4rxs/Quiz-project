const express = require('express');
const { getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController, getAllStudentsController, studentLoginController
    , getStudentByEmailController, takeQuizController
    , submitQuizController } =
    require('../controllers/student.controller');

const { getAnnouncementsByStudentID } = require('../services/announcement.service');

const { validateRegisterStudent,
    validateUpdateStudent,
    ValidateChangePassword } =
    require('../validaters/student.validator');

const authMiddleware = require('../authentication/middleWare');



const router = express.Router();


// get routes
router.get('/student/:id', getStudentByIDController);
router.get('/student', getAllStudentsUserNamesController);
router.get('/students', getAllStudentsController);
router.get('/student-email/:email', getStudentByEmailController);
router.post('/take-quiz', takeQuizController);






// post routes
router.post('/student', validateRegisterStudent(), registerStudentController);
router.post('/student-login', studentLoginController);
router.post('/submit-quiz', submitQuizController);

// delete routes
router.delete('/student/:StudentID', deleteStudentByIdController);
router.get('/student-delete/:studentID', deleteStudentByIdController);
router.get('/student-delete/:id', deleteStudentByIdController)


// update routes
router.put('/student/:id', validateUpdateStudent(), updateStudentByIdController);
router.put('/student-pass/:id', ValidateChangePassword(), changeStudentPasswordController);
router.post('/student-update/:id', updateStudentByIdController);
router.post('/student-pass-change/:id', changeStudentPasswordController);

//render routes

router.get('/login/student', (req, res) => {
    res.render('student-login');
});

router.get('/sign/student', (req, res) => {
    res.render('student-signup');
})

router.get('/logout/student', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error in destroying the session: ', err);
            res.status(500).send('Internal server error');
        }
    })
    res.redirect('/quizsystem/login/student');
});

router.get('/my-quiz', (req, res) => {
    res.render('student-quiz');
});

module.exports = router;
