import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    date_time: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["waiting", "confirmed", "completed", "canceled"],
      default: "waiting",
    },
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    consultation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", AppointmentSchema);
