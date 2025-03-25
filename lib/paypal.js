import User from '../models/User.js';
import fetch from 'node-fetch';

export async function generatePaypalAccessToken() {
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

export const generateSubscription = async (user_id, email, name) => {
  try {
    const access_token = await generatePaypalAccessToken();

    if (!user_id || !email || !name) {
      throw new Error('Missing required fields');
    }

    const user = await User.findById(user_id);

    if (!user) {
      throw new Error('User not found');
    }

    if (user.subscription.type === 'active') {
      throw new Error('User already has an active subscription');
    }

    if (
      user.subscription.type === 'inactive' &&
      user.subscription.subscription_id
    ) {
      const api_url =
        process.env.NODE_ENV === 'production'
          ? 'https://api.paypal.com/v1/billing/subscriptions'
          : 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions';

      const response = await fetch(
        `${api_url}/${user.subscription.subscription_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const responseData = await response.json();
      return responseData;
    }

    const body_data = {
      quantity: 1,
      auto_renewal: true,
      plan_id: process.env.PAYPAL_PLAN_ID,
      subscriber: {
        email_address: email,
        name: {
          given_name: name,
        },
      },
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
        locale: 'es-US',
      },
    };

    const subscription_api_url =
      process.env.NODE_ENV === 'production'
        ? 'https://api.paypal.com/v1/billing/subscriptions'
        : 'https://api-m.sandbox.paypal.com/v1/billing/subscriptions';

    const response = await fetch(subscription_api_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body_data),
    });

    if (!response.ok) {
      throw new Error(`Subscription creation failed`);
    }

    const responseData = await response.json();

    try {
      await User.findByIdAndUpdate(user_id, {
        subscription: { subscription_id: responseData.id },
      });
    } catch (error) {
      throw new Error(`Failed to update user subscription: ${error.message}`);
    }

    return responseData;
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};
