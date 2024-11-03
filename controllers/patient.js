import Consultation from "../models/Consultation.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import createError from "../utils/create-error.js";

export async function createPatient(req, res, next) {
  try {
    const {
      name,
      photo_url,
      email,
      phone,
      address,
      date_of_birth,
      gender,
      age,
      insurance,
      marital_status,
      blood_group,
      height,
      weight,
      medical_history,
      doctor_notes,
    } = req.body;

    const user_id = req.user.id;

    if (!name || !gender || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const newPatient = new Patient({
      name,
      photo_url,
      email,
      phone,
      address,
      date_of_birth,
      gender,
      age,
      insurance,
      marital_status,
      blood_group,
      height,
      weight,
      medical_history,
      doctor_notes,
      user_id,
    });

    await newPatient.save();

    await User.findByIdAndUpdate(
      user_id,
      { $push: { patients: newPatient._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Patient created successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function updatePatient(req, res, next) {
  try {
    const { id } = req.params;
    const {
      name,
      photo_url,
      email,
      phone,
      address,
      date_of_birth,
      gender,
      age,
      insurance,
      marital_status,
      blood_group,
      height,
      weight,
      medical_history,
      doctor_notes,
    } = req.body;
    const user_id = req.user.id;
    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }
    const patient = await Patient.findById(id);
    if (!patient) {
      return next(createError(400, "Invalid patient id"));
    }
    if (patient.user_id.toString() !== user_id) {
      return next(createError(400, "Invalid user id"));
    }

    await Patient.findByIdAndUpdate(id, {
      name,
      photo_url,
      email,
      phone,
      address,
      date_of_birth,
      gender,
      age,
      insurance,
      marital_status,
      blood_group,
      height,
      weight,
      medical_history,
      doctor_notes,
    });
    res.status(200).json({
      message: "Patient updated successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function deletePatient(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return next(createError(400, "Invalid patient id"));
    }

    if (patient.user_id.toString() !== user_id) {
      return next(createError(400, "Invalid user id"));
    }

    await User.findByIdAndUpdate(
      user_id,
      { $pull: { patients: id } },
      { new: true }
    );

    await Appointment.deleteMany({
      patient_id: id,
    });

    await Consultation.deleteMany({
      patient_id: id,
    });

    await Patient.findByIdAndDelete(id);

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function getUserPatients(req, res, next) {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(400, "Invalid user id"));
    }

    const patients = await Patient.find({
      _id: { $in: user.patients },
    })
      .populate("appointments")
      .populate("consultations");

    const patientsWithNextAppointment = patients.map((patient) => {
      const nextAppointment = patient.appointments
        .filter((appointment) => new Date(appointment.date_time) >= new Date())
        .sort((a, b) => new Date(a.date_time) - new Date(b.date_time))[0];

      return {
        ...patient.toObject(),
        next_appointment: nextAppointment || null,
      };
    });

    res.status(200).json({
      message: "Patients retrieved successfully",
      data: patientsWithNextAppointment,
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}
