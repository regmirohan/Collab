import express from 'express';
import {Login, checkSession, createInitialAdmin, destroySession} from '../controllers/adminController/adminAuth.controller.js'

const router = express.Router();

router.post('/login', Login);
router.post('/register', createInitialAdmin);

router.get('/session/check', checkSession);
router.get('/session/destroy', destroySession);

export default router;