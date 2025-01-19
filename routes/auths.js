import express from "express";
import { Test, signIn, signUp, verifySession } from "../controllers/auth.js";
import verifyToken from "../utils/verify-token.js";

const router = express.Router();

router.post("/sign-up", signUp);

router.post("/sign-in", Test);

router.get("/verify-session", verifyToken, verifySession);

export default router;
