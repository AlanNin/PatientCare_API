import fetch from 'node-fetch';

async function generateAccessToken() {
  const client_id = process.env.PAYPAL_CLIENT_ID;
  const client_secret = process.env.PAYPAL_CLIENT_SECRET;
  const auth_url =
    process.env.NODE_ENV === 'production'
      ? 'https://api.paypal.com/v1/oauth2/token'
      : 'https://api-m.sandbox.paypal.com/v1/oauth2/token';

  if (!client_id || !client_secret) {
    throw new Error('Missing PayPal credentials');
  }

  const auth = Buffer.from(client_id + ':' + client_secret).toString('base64');
  const response = await fetch(auth_url, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to get access token: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.access_token;
}

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
      access_token = await generateAccessToken();
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
      return res.status(500).send(`Verification request failed: ${errorData}`);
    }

    const verificationResult = await verificationResponse.json();

    if (verificationResult.verification_status !== 'SUCCESS') {
      console.error('Webhook verification failed:', verificationResult);
      return res.status(400).send('Webhook verification failed');
    }

    switch (webhook_event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        console.log('Subscription activated:', webhook_event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        console.log('Subscription cancelled:', webhook_event);
        break;
      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
        console.log('Payment failed:', webhook_event);
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        console.log('Subscription expired:', webhook_event);
        break;
      case 'PAYMENT.CAPTURE.COMPLETED':
        console.log('Payment capture completed:', webhook_event);
        break;
      default:
        console.log('Unhandled event type:', webhook_event.event_type);
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

    const access_token = await generateAccessToken();
    const body_data = {
      url: 'https://bb15-2001-1308-274f-2d00-45ab-4fa-8980-4c0c.ngrok-free.app/api/payment/webhook',
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      event_type: 'PAYMENT.AUTHORIZATION.CREATED',
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
