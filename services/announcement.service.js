
const { query } = require('../database/db');

/**
 * Save an announcement to the database.
 * @param {int} instructorID - ID of the instructor posting the announcement.
 * @param {int} studentID - ID of the student to whom the announcement is directed.
 * @param {string} content - Announcement content.
 * @param {timestamp} timestamp - Timestamp of the announcement.
 * @returns {Object} - An object containing the result of the announcement insertion.
 */
const saveAnnouncement = async (instructorID, studentID, content, timestamp) => {
  try {
    const sql = 'INSERT INTO Announcement (InstructorID, StudentID, Content, Timestamp) VALUES (?, ?, ?, ?)';
    const result = await query(sql, [instructorID, studentID, content, timestamp]);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get announcements for a specific student.
 * @param {int} studentID - ID of the student for whom announcements are retrieved.
 * @returns {Object} - An object containing an array of announcements for the specified student.
 */
const getAnnouncementsByStudentID = async (studentID) => {
  try {
    const sql = 'SELECT * FROM Announcement WHERE StudentID = ?';
    const announcements = await query(sql, [studentID]);
    return announcements;
  } catch (error) {
    throw new Error(error);
  }
};


/**
 * delete announcements for a specific announcemet.
 * @param {int} announcementID - ID of the student for whom announcements are retrieved.
 */
const deleteAnnouncementService = async (announcementID) => {
  try {
      const sql = 'DELETE FROM announcement WHERE AnnouncementID = ?'; 
      const result = await query(sql, [announcementID]);
      return result;
  } catch (error) {
      console.error('Error in deleteAnnouncementService:', error);
      throw error;
  }
};

module.exports = {
  saveAnnouncement,
  getAnnouncementsByStudentID,
  deleteAnnouncementService
};
