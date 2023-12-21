
const { message } = require('statuses');
const { getAnnouncementsByStudentID, saveAnnouncement, deleteAnnouncementService } = require('../services/announcement.service');




/**
 * Controller for getting announcements for a specific student.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The HTTP response containing an array of announcements if announcements are found,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during retrieval.
 */
const saveAnnouncementController = async (req, res) => {
    try {
        // Extract instructorID, studentID, content, and timestamp from the request body
        const { instructorID, studentID, content, timestamp } = req.body;

        // Call the service function to save the announcement
        const result = await saveAnnouncement(instructorID, studentID, content, timestamp);

        // Check the result and send the appropriate response
        if (result.affectedRows === 1) {

            res.redirect(`/quizsystem/send-announ/${instructorID}`);
            // res.status(200).json({ message: 'Announcement saved successfully' });
        } else {
            res.status(500).json({ message: 'Announcement saving failed' });
        }
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error('Error in saveAnnouncementController:', error);
        res.status(500).json({ message: 'An error occurred during announcement saving' });
    }
};


/**
 * Controller for getting announcements for a specific student.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} - The HTTP response containing an array of announcements if announcements are found,
 * or a 500 Internal Server Error response with an error message if an unexpected issue occurs during retrieval.
 */
const getAnnouncementsByStudentIDController = async (req, res) => {
    const { studentID } = req.params;

    try {
        // Call the service function to get announcements for the student
        const announcements = await getAnnouncementsByStudentID(studentID);

        res.render('announcements', { announcements });
        // res.status(200).json(announcements);
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response with an error message
        console.error('Error in getAnnouncementsByStudentIDController:', error);
        res.status(500).json({ message: 'An error occurred during announcement retrieval' });
    }
};

const deleteAnnouncementController = async (req, res) => {
    try {
        const { announcementID } = req.params;

        const result = await deleteAnnouncementService(announcementID);

        if (result === 1) {
            // Deletion successful, generate a student ID (replace this with your logic)

            res.status(500).json(`no announcemts found with id ${announcementID}`)

        } else {
            res.status(200).json(`announcement checked `);
        }
    } catch (error) {
        console.error("an error occurred in delete announcementController", error);
        res.status(500).json({ message: 'an error occurred during deletion' });
    }
};

module.exports = {
    saveAnnouncementController,
    getAnnouncementsByStudentIDController,
    deleteAnnouncementController
}