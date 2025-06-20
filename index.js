import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auths.js";
import userRoutes from "./routes/users.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import consultationRoutes from "./routes/consultations.js";
import paymentRoutes from "./routes/payments.js";
import { errorHandler } from "./middlewares/error-handler.js";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const app = express();

let dbConnection = null;
const initializeDB = async () => {
  if (!dbConnection) {
    dbConnection = await connectDB();
  }
  return dbConnection;
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await initializeDB();
    next();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Medelle API",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/payment", paymentRoutes);

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

const PORT = process.env.PORT || 3000;

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, async () => {
    await initializeDB();
    console.log("Server initialized successfully on port", PORT);
  });
}

export default app;
