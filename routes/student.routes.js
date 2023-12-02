const express = require('express');
const { getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController } =
    require('../controllers/student.controller');


const { validateRegisterStudent,
    validateUpdateStudent,
    ValidateChangePassword } =
    require('../validaters/student.validator');


const router = express.Router();


// get routes
router.get('/student/:id', getStudentByIDController);
router.get('/student', getAllStudentsUserNamesController);


// post routes
router.post('/student', validateRegisterStudent(), registerStudentController);

// delete routes
router.delete('/student/:id', deleteStudentByIdController);

// update routes
router.put('/student/:id', validateUpdateStudent(), updateStudentByIdController);
router.put('/student-pass/:id', ValidateChangePassword(), changeStudentPasswordController);




module.exports = router;
