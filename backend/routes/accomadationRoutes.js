import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controller/accomadationModel.js";

const router = express.Router();

router.post("/create", createBooking);
router.get("/book", getAllBookings);
router.get("/booking:id", getBookingById);
router.put("/update:id", updateBooking);
router.delete("/delete:id", deleteBooking);

export default router;
