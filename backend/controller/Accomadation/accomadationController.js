import Booking from "../../models/accomadationModel.js"; // adjust path as needed

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      accommodation,
      name,
      idNumber,
      emailAddress,
      contactNo,
      packageType,
      numberOfTravellers,
      specialNeeds,
    } = req.body;

    const booking = new Booking({
      accommodation,
      name,
      idNumber,
      emailAddress,
      contactNo,
      packageType,
      numberOfTravellers,
      specialNeeds,
    });

    const savedBooking = await booking.save();
    return res.status(201).json(savedBooking);
  } catch (error) {
    return res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("accommodation");
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// Get a booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("accommodation");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching booking", error: error.message });
  }
};

// Update a booking by ID
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: "Error updating booking", error: error.message });
  }
};

// Delete a booking by ID
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting booking", error: error.message });
  }
};
