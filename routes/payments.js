import express from 'express';
import {
  handleWebhook,
  simulateWebhook,
  validatePaymentRoute,
} from '../controllers/payment.js';

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.post('/simulate', simulateWebhook);

router.get('/validate-token', validatePaymentRoute);

export default router;
