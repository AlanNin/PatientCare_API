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
      enum: [
        "single",
        "married",
        "divorced",
        "widowed",
        "separated",
        "free_union",
        "other",
      ],
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    medical_history: {
      pathological_history: {
        type: String,
      },
      family_history: {
        type: String,
      },
      surgical_history: {
        type: String,
      },
      toxic_habits: {
        type: String,
      },
      allergy_history: {
        type: String,
      },
      gynecological_history: {
        menarche: {
          type: Number,
        },
        telarche: {
          type: Number,
        },
        first_coitus: {
          type: Number,
        },
      },
      transfusion_history: {
        type: String,
      },
      obstetric_history: {
        type: String,
      },
    },
    doctor_notes: {
      type: String,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
    consultations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Consultation",
      },
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", PatientSchema);
