import express from "express";
import verifyToken from "../utils/verify-token.js";
import { deleteUser, updateUser } from "../controllers/user.js";

const router = express.Router();

router.put("/update", verifyToken, updateUser);

router.delete("/delete", verifyToken, deleteUser);

export default router;
