import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";


import bookingsRouter from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/bookings", bookingsRouter);

mongoose.connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error("❌ Mongo connection error:", err.message);
  });
