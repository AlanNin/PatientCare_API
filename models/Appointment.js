import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  date_time: {
    type: Date,
    required: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
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
