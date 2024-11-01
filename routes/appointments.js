import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createAppointment,
  deleteAppointment,
  getPatientAppointments,
  getUserAppointments,
  updateAppointment,
} from "../controllers/appointment.js";

const router = express.Router();

router.post("/create", verifyToken, createAppointment);

router.put("/update/:id", verifyToken, updateAppointment);

router.delete("/delete/:id", verifyToken, deleteAppointment);

router.get("/get-from-user", verifyToken, getUserAppointments);

router.get("/get-from-patient/:id", verifyToken, getPatientAppointments);

export default router;
