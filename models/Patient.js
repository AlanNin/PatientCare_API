import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    photo_url: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    date_of_birth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
    },
    insurance: {
      type: String,
    },
    marital_status: {
      type: String,
    },
    blood_group: {
      type: String,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    doctor_notes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
