import jwt from "jsonwebtoken";
import createError from "./create-error.js";

export default function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return next(createError(401, "You are not authenticated"));

  const token = authHeader.split(" ")[1];

  if (!token) return next(createError(401, "You are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(createError(403, "Invalid token"));
    req.user = user;
    next();
  });
}
