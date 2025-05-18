import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(req, res) {
  try {
    const data = req.body;

    // Validate required fields
    const requiredFields = ['full_name', 'email', 'password'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Check if email already exists
    const userExists = await User.findOne({ email: data.email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Set default profile picture if none provided
    if (!data.profile_picture) {
      data.profile_picture = 'https://via.placeholder.com/150';
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 8);

    const newUser = new User(data);
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Please contact support." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function getProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login and try again" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      profile_picture: user.profile_picture,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function registerPet(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please login and try again" });
    }

    if (req.user.user_type !== "pet_owner") {
      return res.status(403).json({ message: "Only pet owners can register pets" });
    }

    const { name, species, breed, age, gender, pet_image } = req.body;

    if (!name || !species || !breed) {
      return res.status(400).json({ message: "Name, species, and breed are required" });
    }

    const petData = {
      owner_id: req.user._id,
      name,
      species,
      breed,
      age,
      gender,
      pet_image: pet_image || [],
    };

    const newPet = new Pet(petData);
    await newPet.save();

    res.status(201).json({ message: "Pet registered successfully", pet: newPet });
  } catch (error) {
    console.error("Error registering pet:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
