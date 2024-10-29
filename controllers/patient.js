import Patient from "../models/Patient.js";
import User from "../models/User.js";
import createError from "../utils/create-error.js";

export async function createPatient(req, res, next) {
  try {
    const {
      name,
      email,
      phone,
      address,
      gender,
      age,
      blood_group,
      height,
      weight,
      allergies,
      symptoms,
      medical_history,
      doctor_notes,
    } = req.body;

    const user_id = req.user.id;

    if (!name || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const newPatient = new Patient({
      name,
      email,
      phone,
      address,
      gender,
      age,
      blood_group,
      height,
      weight,
      allergies,
      symptoms,
      medical_history,
      doctor_notes,
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

    const patients = await Patient.find({ _id: { $in: user.patients } });

    res.status(200).json({
      message: "Patients retrieved successfully",
      data: patients || [],
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}
