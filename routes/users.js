import express from "express";
import verifyToken from "../utils/verify-token.js";
import {
  deleteUser,
  deleteUserField,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

router.put("/update", verifyToken, updateUser);

router.delete("/delete", verifyToken, deleteUser);

router.put("/delete-field", verifyToken, deleteUserField);

export default router;
