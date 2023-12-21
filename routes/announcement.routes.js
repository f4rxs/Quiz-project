const express = require('express');
const router = express.Router();

const { saveAnnouncementController, getAnnouncementsByStudentIDController ,deleteAnnouncementController
} = require('../controllers/announcement.controller');


// post routes
router.post('/announcement', saveAnnouncementController);

// get routes
router.get('/announcment/:studentID', getAnnouncementsByStudentIDController);


// delete routes
router.get('/check-announc/:announcementID',deleteAnnouncementController);



module.exports = router;
