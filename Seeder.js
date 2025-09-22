import mongoose from "mongoose";
import booking from "./Model/booking.js";
import dotenv from "dotenv";
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("❌ No MONGO_URL found in .env file");
  process.exit(1);
}

const sample = [
  {
    customerName: "Asha Patel",
    carDetails: { make: "Hyundai", model: "i20", year: 2018, type: "hatchback" },
    serviceType: "Basic Wash",
    date: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    timeSlot: "09:00-09:30",
    duration: 30,
    price: 200,
    status: "Completed",
    addOns: ["Interior Cleaning"],
    rating: 4
  },
  {
    customerName: "Ravi Kumar",
    carDetails: { make: "Maruti", model: "Dzire", year: 2020, type: "sedan" },
    serviceType: "Deluxe Wash",
    date: new Date(),
    timeSlot: "14:00-14:45",
    duration: 45,
    price: 450,
    status: "Confirmed",
    addOns: ["Polishing"]
  },
  {
    customerName: "Sneha Mehta",
    carDetails: { make: "BMW", model: "X5", year: 2022, type: "luxury" },
    serviceType: "Full Detailing",
    date: new Date(Date.now() + 5 * 24 * 3600 * 1000),
    timeSlot: "11:00-13:00",
    duration: 120,
    price: 3500,
    status: "Pending",
    addOns: ["Polishing", "Interior Cleaning"]
  },
  {
    customerName: "Arjun Singh",
    carDetails: { make: "Tata", model: "Harrier", year: 2019, type: "SUV" },
    serviceType: "Deluxe Wash",
    date: new Date(Date.now() + 2 * 24 * 3600 * 1000),
    timeSlot: "16:00-16:45",
    duration: 45,
    price: 600,
    status: "Cancelled"
  },
  {
    customerName: "Maya Rao",
    carDetails: { make: "Honda", model: "City", year: 2017, type: "sedan" },
    serviceType: "Basic Wash",
    date: new Date(Date.now() + 1 * 24 * 3600 * 1000),
    timeSlot: "10:00-10:30",
    duration: 30,
    price: 220,
    status: "Confirmed"
  }
];

(async function seed() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    await booking.deleteMany({});
    await booking.insertMany(sample);
    console.log("Seeded bookings");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
})();
