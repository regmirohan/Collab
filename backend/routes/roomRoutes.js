import express from 'express';
import { getParticipants, getUserName, joinRoom, setStatus } from '../controllers/room.controller.js';
const router = express.Router();


router.post('/join',joinRoom);
router.put('/updateStatus', setStatus);
router.post('/participants', getParticipants);
router.get('/getName',getUserName)


export default router;
