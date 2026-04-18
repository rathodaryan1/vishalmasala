const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  },
});

router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const filename = `product-${Date.now()}.webp`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);

    // Process image with Sharp: Resize, convert to WebP, and compress
    await sharp(req.file.buffer)
      .resize(1000, 1000, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 75 })
      .toFile(outputPath);

    // Return the URL for the frontend
    const imageUrl = `/uploads/${filename}`;
    res.json({
      success: true,
      url: imageUrl,
      message: "Image uploaded and compressed successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

module.exports = router;
