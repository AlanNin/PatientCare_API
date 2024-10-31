import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createPatient,
  deletePatient,
  getUserPatients,
  updatePatient,
} from "../controllers/patient.js";

const router = express.Router();

router.post("/create", verifyToken, createPatient);

router.put("/update/:id", verifyToken, updatePatient);

router.delete("/delete/:id", verifyToken, deletePatient);

router.get("/get-from-user", verifyToken, getUserPatients);

export default router;
