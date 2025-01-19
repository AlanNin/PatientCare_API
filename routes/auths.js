import express from "express";
import { signIn, signUp, verifySession } from "../controllers/auth.js";
import verifyToken from "../utils/verify-token.js";

const router = express.Router();

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.get("/verify-session", verifyToken, verifySession);

export default router;
