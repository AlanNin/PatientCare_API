import User from "../models/User.js";
import Apppointment from "../models/Appointment.js";
import Consultation from "../models/Consultation.js";
import Patient from "../models/Patient.js";
import createError from "../utils/create-error.js";
import validatePassword from "../utils/validate-password.js";
import bcrypt from "bcryptjs";

export async function updateUser(req, res, next) {
  try {
    const {
      name,
      photo_url,
      work_logo_url,
      email,
      personal_phone,
      work_phone,
      speciality,
      work_address,
      gender,
      old_password,
      new_password,
      confirm_new_password,
    } = req.body;

    const user_id = req.user.id;

    if (!user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    let newPassword = null;

    if (old_password || new_password || confirm_new_password) {
      if (!old_password || !new_password || !confirm_new_password) {
        return next(createError(400, "Missing required fields"));
      }

      const isOldPasswordCorrect = await bcrypt.compare(
        old_password,
        user.password
      );
      if (!isOldPasswordCorrect) {
        return next(createError(400, "Old password does not match"));
      }

      if (new_password !== confirm_new_password) {
        return next(createError(400, "Passwords do not match"));
      }

      if (!validatePassword(new_password)) {
        return next(
          createError(
            400,
            "Password must have at least 1 uppercase letter, 1 number, and be at least 8 characters long"
          )
        );
      }

      const salt = bcrypt.genSaltSync(10);
      newPassword = bcrypt.hashSync(new_password, salt);
    }

    const updateData = {};

    if (name) updateData.name = name;
    if (photo_url) updateData.photo_url = photo_url;
    if (work_logo_url) updateData.work_logo_url = work_logo_url;
    if (email) updateData.email = email;
    if (personal_phone) updateData.personal_phone = personal_phone;
    if (work_phone) updateData.work_phone = work_phone;
    if (speciality) updateData.speciality = speciality;
    if (work_address) updateData.work_address = work_address;
    if (gender) updateData.gender = gender;
    if (newPassword) updateData.password = newPassword;

    await User.findByIdAndUpdate(user_id, updateData);

    res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Internal server error"));
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user_id = req.user.id;

    if (!user_id) {
      return next(createError(400, "Missing required fields"));
    }

    const user = await User.findById(user_id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    await Apppointment.deleteMany({
      user_id: user_id,
    });

    await Consultation.deleteMany({
      user_id: user_id,
    });

    await Patient.deleteMany({
      user_id: user_id,
    });

    await User.findByIdAndDelete(user_id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(createError(500, "Internal server error"));
  }
}
