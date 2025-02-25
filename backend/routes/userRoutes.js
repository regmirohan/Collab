import express from 'express';
import { changePassword, forgotPassword, login, register } from '../controllers/auth.controller.js';
import { getUserData, updateProfile } from '../controllers/profile.controller.js';
import { sendMail } from '../controllers/mail.controller.js';
const router = express.Router();

router.post('/login',login);
router.post('/register',register);

router.get('/forgotPassword/:email',forgotPassword);
router.put('/changePassword/:email',changePassword);
router.get('/getUser',getUserData);
router.put('/updateProfile',updateProfile);

router.post('/sendMail', sendMail)
export default router;
