import express from 'express';
import { handleWebhook, simulateWebhook } from '../controllers/paypal.js';

const router = express.Router();

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

router.post('/simulate', simulateWebhook);

export default router;
