// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import bookingsRouter from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Vercel!" });
});

app.use("/api/bookings", bookingsRouter);

const MONGO_URL = process.env.MONGO_URL;

// Vercel handler
export default async function handler(req, res) {
  try {
    // Connect to MongoDB on every invocation
    await mongoose.connect(MONGO_URL, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });

    // Forward the request to Express
    app(req, res);
  } catch (err) {
    console.error("Mongo connection error:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
}
