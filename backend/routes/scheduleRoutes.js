import express from 'express';
import { scheduleMeeting, meetingDetails, deleteMeeting, getByMeetingId, updateByMeetingId, getRole, updateParticipants, setStatus} from '../controllers/meeting.controller.js';
const router = express.Router();

router.post('/schedule',scheduleMeeting);
router.get('/details', meetingDetails);
router.delete('/delete',deleteMeeting);
router.get('/:id', getByMeetingId);
router.put('/updateStatus', setStatus);
router.put('/update/:id', updateByMeetingId);
router.put('/updateParticipants/:id', updateParticipants);
router.get('/getRole/:id', getRole);

export default router;
