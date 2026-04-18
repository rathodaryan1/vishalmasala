const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./backend/models/Category");

dotenv.config();

const categories = [
  { name: "BASIC SPICES", image: "https://v-spice.com/wp-content/uploads/2021/05/basic-spices.png" },
  { name: "BLENDED SPICES", image: "https://v-spice.com/wp-content/uploads/2021/05/blended-spices.png" },
  { name: "SPECIALTY SPICES", image: "https://v-spice.com/wp-content/uploads/2021/05/hing.png" },
  { name: "POWDER SPICES", image: "https://v-spice.com/wp-content/uploads/2021/05/exotic-range.png" },
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/vishalmasala");
    
    // Only seed if empty
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(categories);
      console.log("Categories seeded successfully!");
    } else {
      console.log("Categories already exist, skipping seed.");
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedCategories();
