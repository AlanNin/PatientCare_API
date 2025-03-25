import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import createError from '../utils/create-error.js';
import jwt from 'jsonwebtoken';
import lowercaseString from '../utils/lowercase-string.js';
import validatePassword from '../utils/validate-password.js';
import { generateSubscription } from '../lib/paypal.js';
import validateEmail from '../utils/validate-email.js';
import { sendVerificationEmail } from '../lib/nodemailer.js';

export async function signUp(req, res, next) {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (!name || !email || !password || !confirm_password) {
      return next(createError(400, 'Missing required fields'));
    }

    const existingUser = await User.findOne({ email: lowercaseString(email) });

    if (existingUser) {
      return next(createError(400, 'Email not available'));
    }

    if (password !== confirm_password) {
      return next(createError(400, 'Passwords do not match'));
    }

    if (!validatePassword(password)) {
      return next(
        createError(
          400,
          'Password must have at least 1 uppercase letter, 1 number, and be at least 8 characters long'
        )
      );
    }

    if (!validateEmail(email)) {
      return next(createError(400, 'Invalid email'));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed_password = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
      email: lowercaseString(email),
      password: hashed_password,
    });

    await newUser.save();

    try {
      const email_token = jwt.sign(
        { id: newUser._id },
        process.env.EMAIL_JWT_SECRET,
        { expiresIn: '30m' }
      );
      await sendVerificationEmail(newUser.email, newUser.name, email_token);
      console.log('Verification email sent successfully.');
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      await User.findByIdAndDelete(newUser._id);
      return next(createError(500, 'Failed to send verification email'));
    }

    let subscription_data = null;
    try {
      subscription_data = await generateSubscription(
        newUser._id.toString(),
        newUser.email,
        newUser.name
      );
    } catch (error) {
      await User.findByIdAndDelete(newUser._id);
      return next(createError(500, 'Internal server error'));
    }

    res.status(201).json({
      message:
        'User created successfully. Please check your email to verify your account.',
      subscription_data,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, 'Internal server error'));
  }
}

export async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createError(400, 'Missing required fields'));
    }

    const user = await User.findOne({ email: lowercaseString(email) });

    if (!user) {
      return next(createError(400, 'Invalid email or password'));
    }

    const is_password_valid = await bcrypt.compare(password, user.password);

    if (!is_password_valid) {
      return next(createError(400, 'Invalid email or password'));
    }
    if (
      !user.subscription.type ||
      (user.subscription.type === 'inactive' &&
        user.role !== 'administrator' &&
        user.role !== 'privileged')
    ) {
      const subscription_data = await generateSubscription(
        user._id.toString(),
        user.email,
        user.name
      );

      return res.status(400).json({
        status: 400,
        message: 'Subscription inactive',
        subscription_data,
      });
    }

    if (!user.email_verified) {
      return res.status(400).json({
        status: 400,
        message: 'Email not verified',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    user.password = undefined;

    res.status(200).json({
      message: 'User logged in successfully',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    return next(createError(500, 'Internal server error'));
  }
}

export async function verifySession(req, res, next) {
  try {
    const user_id = req.user.id;

    const user = await User.findById(user_id).select('-password');

    if (!user) {
      return next(createError(401, 'User not found'));
    }

    const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: 'Session verified successfully',
      data: {
        user,
        token: newToken,
      },
    });
  } catch (error) {
    return next(createError(500, 'Error verifying session'));
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;

    if (!token) {
      return next(createError(400, 'Faltan campos requeridos.'));
    }

    const decoded = jwt.verify(token, process.env.EMAIL_JWT_SECRET);

    if (!decoded.id) {
      return next(createError(400, 'Token inválido.'));
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(createError(400, 'Usuario no encontrado.'));
    }

    user.email_verified = true;
    await user.save();

    res.status(200).json({
      message: 'Email verified successfully.',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        createError(401, 'El token ha expirado. Por favor, solicita uno nuevo.')
      );
    } else if (error.name === 'JsonWebTokenError') {
      return next(createError(400, 'Token inválido.'));
    } else {
      return next(createError(500, 'Error interno del servidor.'));
    }
  }
}

export async function resendEmailVerification(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createError(400, 'Faltan campos requeridos.'));
    }

    const user = await User.findOne({ email: lowercaseString(email) });

    if (!user) {
      return next(createError(400, 'Usuario no encontrado.'));
    }

    if (user.email_verified) {
      return next(createError(400, 'El email ya ha sido verificado.'));
    }

    const email_token = jwt.sign(
      { id: user._id },
      process.env.EMAIL_JWT_SECRET,
      { expiresIn: '30m' }
    );

    try {
      await sendVerificationEmail(user.email, user.name, email_token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return next(createError(500, 'Failed to send verification email'));
    }

    res.status(200).json({
      message: 'Verification email sent successfully.',
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(
        createError(401, 'El token ha expirado. Por favor, solicita uno nuevo.')
      );
    } else if (error.name === 'JsonWebTokenError') {
      return next(createError(400, 'Token inválido.'));
    } else {
      return next(createError(500, 'Error interno del servidor.'));
    }
  }
}
