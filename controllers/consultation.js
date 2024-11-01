import Appointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import Patient from "../models/Patient.js";
import User from "../models/User.js";
import createError from "../utils/create-error.js";

export async function createConsultation(req, res, next) {
  try {
    const {
      reason,
      symptoms,
      diagnosis,
      laboratory_studies,
      images_studies,
      treatment,
      patient_id,
      appointment_id,
    } = req.body;

    const user_id = req.user.id;

    if (
      !reason ||
      !symptoms ||
      !diagnosis ||
      !treatment ||
      !patient_id ||
      !user_id
    ) {
      return next(createError(400, "Missing required fields"));
    }

    const newConsultation = new Consultation({
      reason,
      symptoms,
      diagnosis,
      laboratory_studies,
      images_studies,
      treatment,
      patient_id,
      user_id,
      appointment_id,
    });

    await newConsultation.save();

    await User.findByIdAndUpdate(
      user_id,
      { $push: { consultations: newConsultation._id } },
      { new: true }
    );

    await Patient.findByIdAndUpdate(
      user_id,
      { $push: { consultations: newConsultation._id } },
      { new: true }
    );

    await Appointment.findByIdAndUpdate(appointment_id, {
      status: "completed",
    });

    res.status(201).json({
      message: "Consultation created successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function deleteConsultation(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return next(createError(400, "Invalid consultation id"));
    }

    if (consultation.user_id.toString() !== user_id) {
      return next(createError(400, "Invalid user id"));
    }

    await User.findByIdAndUpdate(
      user_id,
      { $pull: { consultations: id } },
      { new: true }
    );

    await Patient.findByIdAndUpdate(
      user_id,
      { $pull: { consultations: id } },
      { new: true }
    );

    await Consultation.findByIdAndDelete(id);

    res.status(200).json({
      message: "Consultation deleted successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function updateConsultation(req, res, next) {
  try {
    const { id } = req.params;
    const {
      reason,
      symptoms,
      diagnosis,
      laboratory_studies,
      images_studies,
      treatment,
      patient_id,
      appointment_id,
    } = req.body;
    const user_id = req.user.id;

    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const consultation = await Consultation.findById(id);
    if (!consultation) {
      return next(createError(400, "Invalid consultation id"));
    }

    if (consultation.user_id.toString() !== user_id) {
      return next(createError(400, "Invalid user id"));
    }

    const updateData = {};
    if (reason) updateData.reason = reason;
    if (symptoms) updateData.symptoms = symptoms;
    if (diagnosis) updateData.diagnosis = diagnosis;
    if (laboratory_studies) updateData.laboratory_studies = laboratory_studies;
    if (images_studies) updateData.images_studies = images_studies;
    if (treatment) updateData.treatment = treatment;
    if (patient_id) updateData.patient_id = patient_id;
    if (appointment_id) updateData.appointment_id = appointment_id;

    await Consultation.findByIdAndUpdate(id, updateData);

    res.status(200).json({
      message: "Consultation updated successfully",
    });
  } catch (error) {
    console.log(error);

    return next(createError(500, "Internal server error"));
  }
}

export async function getUserConsultations(req, res, next) {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(400, "Invalid user id"));
    }

    const consultations = await Consultation.find({
      _id: { $in: user.consultations },
    }).populate("patient_id");

    res.status(200).json({
      message: "Consultations retrieved successfully",
      data: consultations || [],
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}
