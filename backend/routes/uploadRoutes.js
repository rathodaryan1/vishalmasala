const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Configure multer for memory storage initially (so we can process with sharp)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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
    const fileName = `product-${Date.now()}.webp`;
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);

    // Process image with Sharp and save to disk
    await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toFile(uploadPath);

    // Return the relative path which will be prefixed by the frontend's getImageUrl
    const relativeUrl = `/uploads/${fileName}`;

    res.json({
      success: true,
      url: relativeUrl,
      message: "Image processed and saved successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

module.exports = router;
