import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createAppointment,
  deleteAppointment,
  getUserAppointments,
  updateAppointment,
} from "../controllers/appointment.js";

const router = express.Router();

router.post("/create", verifyToken, createAppointment);

router.put("/update/:id", verifyToken, updateAppointment);

router.delete("/delete/:id", verifyToken, deleteAppointment);

router.get("/get-from-user", verifyToken, getUserAppointments);

export default router;
