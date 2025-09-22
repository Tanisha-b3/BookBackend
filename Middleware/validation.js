import Joi from "joi";

export const createBookingSchema = Joi.object({
  customerName: Joi.string().min(2).max(100).required(),
  carDetails: Joi.object({
    make: Joi.string().allow(""),
    model: Joi.string().allow(""),
    year: Joi.number().integer().min(1900).max(2100).optional(),
    type: Joi.string().valid("sedan","SUV","hatchback","luxury").optional(),
  }).optional(),
  serviceType: Joi.string().valid("Basic Wash","Deluxe Wash","Full Detailing").required(),
  date: Joi.date().required(),
  timeSlot: Joi.string().optional(),
  duration: Joi.number().integer().min(5).max(600).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  status: Joi.string().valid("Pending","Confirmed","Completed","Cancelled").optional(),
  rating: Joi.number().integer().min(1).max(5).optional(),
  addOns: Joi.array().items(Joi.string()).optional()
});

export const updateBookingSchema = createBookingSchema.fork(["customerName","serviceType","date"], (schema) => schema.optional());
