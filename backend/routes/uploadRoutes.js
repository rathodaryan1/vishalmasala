const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for raw uploads
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
    // Aggressively process image with Sharp
    // Resize to max 800px and convert to WebP with 50% quality
    const buffer = await sharp(req.file.buffer)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 40 })
      .toBuffer();

    // Convert to Base64 Data URI
    const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;

    res.json({
      success: true,
      url: base64Image,
      message: "Image compressed and converted to Base64 successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Error processing image" });
  }
});

module.exports = router;
