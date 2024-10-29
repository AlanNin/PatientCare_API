import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createAppointment,
  getUserAppointments,
} from "../controllers/appointment.js";

const router = express.Router();

router.post("/create", verifyToken, createAppointment);

router.get("/get-from-user", verifyToken, getUserAppointments);

export default router;
