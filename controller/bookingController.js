import booking from "../Model/booking.js";
import mongoose from "mongoose";
import { createBookingSchema, updateBookingSchema} from "../Middleware/validation.js"
export const getBookings = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    serviceType,
    status,
    carType,
    dateFrom,
    dateTo,
  } = req.query;

  const query = {};

  if (serviceType) query.serviceType = serviceType;
  if (status) query.status = status;
  if (carType) query["carDetails.type"] = carType;
  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) query.date.$gte = new Date(dateFrom);
    if (dateTo) query.date.$lte = new Date(dateTo);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [bookings, total] = await Promise.all([
    booking.find(query).sort(sort).skip(skip).limit(Number(limit)),
    booking.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
    data: bookings
  });
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

  const Booking = await booking.findById(id);
  if (!Booking) return res.status(404).json({ success: false, message: "Booking not found" });

  res.status(200).json({ success: true, data: Booking });
};

export const searchBookings = async (req, res) => {
  const { q = "", page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const textResults = await booking.find({ $text: { $search: q } })
    .skip(skip).limit(Number(limit));
  if (textResults.length > 0) {
    const total = await booking.countDocuments({ $text: { $search: q } });
    return res.json({ success: true, meta: { total, page: Number(page), limit: Number(limit) }, data: textResults });
  }

  const regex = new RegExp(q, "i");
  const results = await booking.find({
    $or: [
      { customerName: regex },
      { "carDetails.make": regex },
      { "carDetails.model": regex },
      { "carDetails.type": regex }
    ]
  }).skip(skip).limit(Number(limit));

  const total = await booking.countDocuments({
    $or: [
      { customerName: regex },
      { "carDetails.make": regex },
      { "carDetails.model": regex },
      { "carDetails.type": regex }
    ]
  });

  res.json({ success: true, meta: { total, page: Number(page), limit: Number(limit) }, data: results });
};

export const createBooking = async (req, res) => {
  const { error, value } = createBookingSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const Booking = await booking.create(value);
  res.status(201).json({ success: true, data: Booking });
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });

  const { error, value } = updateBookingSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  const Booking = await booking.findByIdAndUpdate(id, value, { new: true });
  if (!Booking) return res.status(404).json({ success: false, message: "Booking not found" });

  res.json({ success: true, data: Booking });
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid id" });
  const Booking = await booking.findByIdAndDelete(id);
  if (!Booking) return res.status(404).json({ success: false, message: "Booking not found" });

  res.json({ success: true, message: "Booking deleted" });
};
