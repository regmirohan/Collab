import express from 'express';
import { checkSession, destroySession } from '../controllers/auth.controller.js';
const router = express.Router();

router.get('/check',checkSession);
router.get('/destroy',destroySession);


export default router;
