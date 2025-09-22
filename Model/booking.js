import mongoose from "mongoose";

const CarDetailsSchema = new mongoose.Schema({
  make: { type: String },
  model: { type: String },
  year: { type: Number },
  type: { type: String } // sedan, SUV, hatchback, luxury
}, { _id: false });

const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, index: true },
  phoneNumber:{ type : Number},
  carDetails: { type: CarDetailsSchema },
  serviceType: { type: String, enum: ["Basic Wash", "Deluxe Wash", "Full Detailing"], required: true, index: true },
  date: { type: Date, required: true, index: true },
  timeSlot: { type: String }, 
  duration: { type: Number },
  price: { type: Number },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending", index: true },
  rating: { type: Number, min: 1, max: 5 },
  addOns: [{ type: String }],
}, { timestamps: true });

BookingSchema.index({ customerName: "text", "carDetails.make": "text", "carDetails.model": "text" });

export default mongoose.model("Booking", BookingSchema);
