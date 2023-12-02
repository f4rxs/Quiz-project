const express = require('express');
const { getStudentByIDController,
    getAllStudentsUserNamesController,
    registerStudentController,
    deleteStudentByIdController,
    updateStudentByIdController,
    changeStudentPasswordController, getAllStudentsController } =
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


// post routes
router.post('/student', validateRegisterStudent(), registerStudentController);

// delete routes
router.delete('/student/:id', deleteStudentByIdController);
router.get('/students/:id', async (req, res) => {
    const studentID = req.params.id;
    const deleteStudentQuery = 'DELETE FROM student WHERE StudentID=?';
    const result = await query(deleteStudentQuery, [studentID]);

    // Redirect or send a response
    res.redirect('/quizsystem/students');
});

// update routes
router.put('/student/:id', validateUpdateStudent(), updateStudentByIdController);
router.put('/student-pass/:id', ValidateChangePassword(), changeStudentPasswordController);




module.exports = router;
