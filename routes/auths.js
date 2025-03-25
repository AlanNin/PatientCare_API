import express from 'express';
import {
  resendEmailVerification,
  signIn,
  signUp,
  verifyEmail,
  verifySession,
} from '../controllers/auth.js';
import verifyToken from '../utils/verify-token.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', signIn);

router.get('/verify-session', verifyToken, verifySession);

router.get('/verify-email', verifyEmail);

router.post('/resend-email-verification', resendEmailVerification);

export default router;
