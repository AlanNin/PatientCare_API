import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auths.js";
import userRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import consultationRoutes from "./routes/consultations.js";
import { errorHandler } from "./middlewares/errror-handler.js";
import cors from "cors";

dotenv.config();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Patient Care API",
  });
});
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});
app.post("/api/test", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/consultation", consultationRoutes);

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  connectDB();
  console.log("Server initialized successfully");
});
