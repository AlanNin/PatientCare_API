import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  createConsultation,
  deleteConsultation,
  getUserConsultations,
  updateConsultation,
} from "../controllers/consultation.js";

const router = express.Router();

router.post("/create", verifyToken, createConsultation);

router.put("/update/:id", verifyToken, updateConsultation);

router.delete("/delete/:id", verifyToken, deleteConsultation);

router.get("/get-from-user", verifyToken, getUserConsultations);

export default router;
