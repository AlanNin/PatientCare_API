import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      enum: ["administrator", "user"],
      default: "user",
      required: true,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    consultations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
