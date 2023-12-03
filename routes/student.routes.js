const express = require('express');
const { getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController, getAllStudentsController, studentLoginController,getStudentByEmailController } =
    require('../controllers/student.controller');


const { validateRegisterStudent,
    validateUpdateStudent,
    ValidateChangePassword } =
    require('../validaters/student.validator');


const router = express.Router();


// get routes
router.get('/student/:id', getStudentByIDController);
router.get('/student', getAllStudentsUserNamesController);
router.get('/students', getAllStudentsController);
router.get('/student-email/:email',getStudentByEmailController);



// post routes
router.post('/student', validateRegisterStudent(), registerStudentController);
router.post('/student-login', studentLoginController);

// delete routes
router.delete('/student/:StudentID', deleteStudentByIdController);
router.get('/student-delete/:studentID', deleteStudentByIdController);


// update routes
router.put('/student/:id', validateUpdateStudent(), updateStudentByIdController);
router.put('/student-pass/:id', ValidateChangePassword(), changeStudentPasswordController);

//render routes

router.get('/login/student', (req, res) => {
    res.render('student-login');
});

router.get('/sign/student',(req,res)=>{
    res.render('student-signup');
})

module.exports = router;
