import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo_url: {
      type: String,
    },
    work_logo_url: {
      type: String,
    },
    personal_phone: {
      type: String,
    },
    work_phone: {
      type: String,
    },
    speciality: {
      type: String,
    },
    work_address: {
      type: String,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    role: {
      type: String,
      enum: ['administrator', 'user', 'privileged'],
      default: 'user',
      required: true,
    },
    subscription: {
      type: {
        type: String,
        enum: ['single-purchase', 'active', 'inactive'],
        default: 'inactive',
        required: true,
      },
      subscription_id: {
        type: String,
      },
      due_date: {
        type: Date,
      },
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
      },
    ],
    consultations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
