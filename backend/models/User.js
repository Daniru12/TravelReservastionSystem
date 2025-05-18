import mongoose from 'mongoose';

// Define the User Schema for TravelEase
const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    profile_picture: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

// Create and export the model
const User = mongoose.model('User', userSchema);

export default User;
