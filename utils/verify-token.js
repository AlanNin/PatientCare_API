import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export function verifyToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) return next(createError(401, "¡No estás autenticado!"));

  jwt.verify(token, process.env.JWT, (error, user) => {
    if (error) return next(createError(403, "¡Token invalido!"));
    req.user = user;
    next();
  });
}
