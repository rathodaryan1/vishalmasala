const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyPayment);

module.exports = router;
