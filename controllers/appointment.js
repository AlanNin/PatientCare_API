import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import createError from "../utils/create-error.js";

export async function createAppointment(req, res, next) {
  try {
    const { date_time, patient_id, reason, status } = req.body;

    const user_id = req.user.id;

    if (!date_time || !patient_id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const newAppointment = new Appointment({
      date_time,
      patient_id,
      reason,
      status,
    });

    await newAppointment.save();

    await User.findByIdAndUpdate(
      user_id,
      { $push: { appointments: newAppointment._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Appointment created successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function updateAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const { date_time, patient_id, reason, status } = req.body;
    const user_id = req.user.id;

    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(400, "User not found"));
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(createError(400, "Invalid appointment id"));
    }

    if (user.appointments.indexOf(id) === -1) {
      return next(createError(400, "Invalid user id"));
    }

    const updateData = {};
    if (date_time) updateData.date_time = date_time;
    if (patient_id) updateData.patient_id = patient_id;
    if (reason) updateData.reason = reason;
    if (status) updateData.status = status;

    await Appointment.findByIdAndUpdate(id, updateData);

    res.status(200).json({
      message: "Appointment updated successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function deleteAppointment(req, res, next) {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    if (!id || !user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(400, "User not found"));
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(createError(400, "Invalid appointment id"));
    }

    if (user.appointments.indexOf(id) === -1) {
      return next(createError(400, "Invalid user id"));
    }

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}

export async function getUserAppointments(req, res, next) {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(400, "Invalid user id"));
    }

    const appointments = await Appointment.find({
      _id: { $in: user.appointments },
    }).populate("patient_id");

    res.status(200).json({
      message: "Appointments retrieved successfully",
      data: appointments || [],
    });
  } catch (error) {
    return next(createError(500, "Internal server error"));
  }
}
