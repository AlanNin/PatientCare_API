import fetch from 'node-fetch';
import { generatePaypalAccessToken } from '../lib/paypal.js';
import User from '../models/User.js';
import createError from '../utils/create-error.js';

export const handleWebhook = async (req, res) => {
  try {
    const transmission_id = req.headers['paypal-transmission-id'];
    const transmission_time = req.headers['paypal-transmission-time'];
    const cert_url = req.headers['paypal-cert-url'];
    const auth_algo = req.headers['paypal-auth-algo'];
    const transmission_sig = req.headers['paypal-transmission-sig'];
    const webhook_id = process.env.PAYPAL_WEBHOOK_ID;
    const webhook_event = req.body;

    if (
      !transmission_id ||
      !transmission_time ||
      !cert_url ||
      !auth_algo ||
      !transmission_sig ||
      !webhook_id
    ) {
      console.error('Missing required PayPal webhook headers');
      return res.status(400).send('Missing required PayPal webhook headers');
    }

    if (process.env.NODE_ENV === 'production') {
      const verification_body = {
        transmission_id,
        transmission_time,
        cert_url,
        auth_algo,
        transmission_sig,
        webhook_id,
        webhook_event,
      };

      let access_token;
      try {
        access_token = await generatePaypalAccessToken();
      } catch (err) {
        console.error('Failed to generate access token:', err);
        return res.status(500).send(`Access token error: ${err.message}`);
      }

      const verificationResponse = await fetch(
        process.env.NODE_ENV === 'production'
          ? 'https://api.paypal.com/v1/notifications/verify-webhook-signature'
          : 'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
          },
          body: JSON.stringify(verification_body),
        }
      );

      if (!verificationResponse.ok) {
        const errorData = await verificationResponse.text();
        console.error('Verification request failed:', errorData);
        return res
          .status(500)
          .send(`Verification request failed: ${errorData}`);
      }

      const verificationResult = await verificationResponse.json();

      if (verificationResult.verification_status !== 'SUCCESS') {
        console.error('Webhook verification failed:', verificationResult);
        return res.status(400).send('Webhook verification failed');
      }
    }

    switch (webhook_event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        try {
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 1);

          await User.updateOne(
            {
              subscription: { subscription_id: webhook_event.resource.id },
            },
            {
              $set: {
                'subscription.type': 'active',
                'subscription.due_date': expirationDate,
              },
            }
          );
          console.log('User subscription activated');
        } catch (error) {
          throw new Error(
            `Failed to update user subscription: ${error.message}`
          );
        }
        break;
      case 'BILLING.SUBSCRIPTION.RENEWED':
        try {
          const expirationDate = new Date();
          expirationDate.setMonth(expirationDate.getMonth() + 1);

          await User.updateOne(
            {
              subscription: { subscription_id: webhook_event.resource.id },
            },
            {
              $set: {
                'subscription.type': 'active',
                'subscription.due_date': expirationDate,
              },
            }
          );
          console.log('User subscription renewed');
        } catch (error) {
          throw new Error(
            `Failed to update user subscription: ${error.message}`
          );
        }
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        try {
          await User.updateOne(
            {
              subscription: { subscription_id: webhook_event.resource.id },
            },
            {
              $set: {
                'subscription.type': 'inactive',
                'subscription.due_date': null,
              },
            }
          );
          console.log('User subscription cancelled');
        } catch (error) {
          throw new Error(
            `Failed to update user subscription: ${error.message}`
          );
        }
        break;
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        try {
          await User.updateOne(
            {
              subscription: { subscription_id: webhook_event.resource.id },
            },
            {
              $set: {
                'subscription.type': 'inactive',
                'subscription.due_date': null,
              },
            }
          );
          console.log('User subscription suspended');
        } catch (error) {
          throw new Error(
            `Failed to update user subscription: ${error.message}`
          );
        }
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        try {
          await User.updateOne(
            {
              subscription: { subscription_id: webhook_event.resource.id },
            },
            {
              $set: {
                'subscription.type': 'inactive',
                'subscription.due_date': null,
              },
            }
          );
          console.log('User subscription expired');
        } catch (error) {
          throw new Error(
            `Failed to update user subscription: ${error.message}`
          );
        }
        break;
      default:
        console.log('Unhandled event type:', webhook_event.event_type);
        break;
    }
    return res.status(200).send('Webhook processed successfully');
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).send(`Webhook error: ${error.message}`);
  }
};

export const simulateWebhook = async (_req, res) => {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return res
        .status(400)
        .send('Webhook simulation is only available in development mode');
    }

    const access_token = await generatePaypalAccessToken();
    const body_data = {
      url: 'https://bb15-2001-1308-274f-2d00-45ab-4fa-8980-4c0c.ngrok-free.app/api/payment/webhook',
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      event_type: 'PAYMENT.SALE.COMPLETED',
      resource_version: '1.0',
    };
    const simulation_api_url =
      process.env.NODE_ENV === 'production'
        ? 'https://api.paypal.com/v1/notifications/simulate-event'
        : 'https://api-m.sandbox.paypal.com/v1/notifications/simulate-event';

    const response = await fetch(simulation_api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(body_data),
    });
    const responseData = await response.text();

    if (!response.ok) {
      console.error('Webhook simulation failed:', responseData);
      return res.status(500).send(`Webhook simulation failed: ${responseData}`);
    }

    console.log('Webhook simulation successful');
    return res.status(200).send('Webhook simulation successful');
  } catch (error) {
    console.error('Webhook simulation error:', error);
    return res.status(500).send(`Webhook simulation error: ${error.message}`);
  }
};

export async function validatePaymentRoute(req, res, next) {
  try {
    const access_token = await generatePaypalAccessToken();

    const { subscription_id } = req.query;

    if (!subscription_id) {
      return next(createError(400, 'Faltan campos requeridos.'));
    }

    const paypal_api_url =
      process.env.NODE_ENV === 'production'
        ? 'https://api.paypal.com/v1/billing/subscriptions'
        : 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions';

    const response = await fetch(`${paypal_api_url}/${subscription_id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      return next(createError(400, 'Subscripción no encontrada.'));
    }

    res.status(200).json({
      message: 'Subscripción validada correctamente.',
    });
  } catch (error) {
    return next(createError(500, 'Error interno del servidor.'));
  }
}
