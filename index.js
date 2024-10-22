import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auths.js";
import { errorHandler } from "./middlewares/errror-handler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log("Server initialized successfully");
});
