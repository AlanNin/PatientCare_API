import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  patient_id: {
    type: String,
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
});

export default mongoose.model("Appointment", AppointmentSchema);
