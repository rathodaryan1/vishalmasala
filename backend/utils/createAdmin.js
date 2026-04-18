const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const User = require(path.resolve(__dirname, "../models/User"));

const createAdmin = async () => {
  const adminData = {
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpassword123",
    role: "admin",
  };

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");

    const userExists = await User.findOne({ email: adminData.email });

    if (userExists) {
      console.log("Admin user already exists");
      process.exit();
    }

    const admin = await User.create(adminData);

    if (admin) {
      console.log("Admin User Created Successfully!");
      console.log("Email:", adminData.email);
      console.log("Password:", adminData.password);
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
