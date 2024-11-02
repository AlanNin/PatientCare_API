import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    laboratory_studies: {
      description: {
        type: String,
      },
      images: {
        type: [String],
      },
    },
    images_studies: {
      description: {
        type: String,
      },
      images: {
        type: [String],
      },
    },
    treatment: {
      type: String,
      required: true,
    },
    gynecological_information: {
      last_menstrual_period: {
        type: Date,
      },
      estimated_due_date: {
        type: Date,
      },
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
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Consultation", ConsultationSchema);
