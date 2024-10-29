import express from "express";
import verifyToken from "../utils/verify-token.js";
import { createPatient, getUserPatients } from "../controllers/patient.js";

const router = express.Router();

router.post("/create", verifyToken, createPatient);

router.get("/get-from-user", verifyToken, getUserPatients);

export default router;
