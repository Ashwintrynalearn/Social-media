import express from 'express';
import { signup, login, updateProfile } from '../controllers/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/profile', updateProfile);

export default router;