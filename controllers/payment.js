import createError from '../utils/create-error.js';

export async function paypalWebhookHandler(req, res, next) {
  try {
    res.status(200).json({
      message: 'User subscribed successfully',
    });
  } catch (error) {
    return next(createError(500, 'Internal server error'));
  }
}
