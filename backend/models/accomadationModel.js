import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    packageType: {
      type: String,
      enum: ["normal", "premium", "vip"],
      default: "normal",
      required: true,
    },
    numberOfTravellers: {
      type: Number,
      required: true,
      min: 1,
    },
    specialNeeds: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
