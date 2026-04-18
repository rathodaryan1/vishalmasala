const Razorpay = require("razorpay");
const crypto = require("crypto");

// @desc    Create Razorpay order
// @route   POST /api/payment/order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: Math.round(Number(amount) * 100), // convert to smallest unit (Paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    console.log("Initiating Razorpay order with options:", options);

    const order = await instance.orders.create(options);

    if (!order) {
      console.error("Razorpay order creation returned null/undefined");
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    res.json(order);
  } catch (error) {
    console.error("RAZORPAY_INITIATION_ERROR:", error);
    res.status(500).json({ 
      message: "Payment initiation failed", 
      error: error.message,
      description: "Please check your .env credentials (RAZORPAY_KEY_ID & RAZORPAY_SECRET)" 
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      res.json({ message: "Payment verified successfully", success: true });
    } else {
      res.status(400).json({ message: "Invalid signature", success: false });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };
