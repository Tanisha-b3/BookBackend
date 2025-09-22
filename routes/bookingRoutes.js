import express from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  searchBookings
} from "../controller/bookingController.js";

const router = express.Router();

router.get("/search", searchBookings);
router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", createBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
