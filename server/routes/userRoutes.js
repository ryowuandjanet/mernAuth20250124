import express from 'express';

const router = express.Router();
import {
  register,
  login,
  verifyEmail,
  resendVerification,
} from '../controllers/userController.js';

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerification);

export default router;
