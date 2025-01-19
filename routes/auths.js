import express from "express";
import { signIn, signUp, verifySession } from "../controllers/auth.js";
import verifyToken from "../utils/verify-token.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    message: "its working",
  });
});

router.post("/sign-up", signUp);

router.post("/sign-in", signIn);

router.get("/verify-session", verifyToken, verifySession);

export default router;
