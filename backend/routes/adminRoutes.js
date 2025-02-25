import express from 'express'
import { deleteUser, addUser, editUser } from '../controllers/adminController/manageUser.controller.js';
import { deleteMeeting, deleteAllMeetings, editMeeting, addMeeting } from '../controllers/adminController/manageMeeting.controller.js';
import { deleteRoom, getRoomsDetail } from '../controllers/adminController/manageRooms.controller.js';
import { getActiveSessions, getCompletedSessions, getTotalMeetings, getTotalUsers } from '../controllers/adminController/dashboard.controller.js';
const router = express.Router();


// manageUser
router.post('/addUser', addUser);
router.put('/editUser', editUser);
router.delete('/deleteuser', deleteUser);

// manageMeeting
router.post('/addMeeting', addMeeting);
router.put('/editMeeting/:id', editMeeting);
router.delete('/deletemeeting', deleteMeeting);
router.delete('/deleteallmeetings', deleteAllMeetings);

// manageRooms
router.get('/roomDetail', getRoomsDetail);
router.delete('/deleteRoom', deleteRoom);

// dashboard
router.get('/getUsers', getTotalUsers);
router.get('/completedSessions', getCompletedSessions);
router.get('/activeSessions', getActiveSessions);
router.get('/getMeetings', getTotalMeetings)



export default router;
