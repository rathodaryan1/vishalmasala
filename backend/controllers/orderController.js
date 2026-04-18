const Order = require("../models/Order");

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (or Public if guest checkout is allowed)
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    customer_name,
    customer_email,
    customer_phone,
    address,
    city,
    state,
    pincode,
    total_amount,
    payment_id,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    const order = new Order({
      user: req.user ? req.user._id : null,
      customer_name,
      customer_email,
      customer_phone,
      address,
      city,
      state,
      pincode,
      cart_items: orderItems,
      total_amount,
      payment_id,
      payment_status: "paid", // Assuming payment is verified before calling this or simplified for this stage
    });

    const createdOrder = await order.save();

    // Send Email to Admin
    const sendEmail = require("../utils/sendEmail");
    const orderItemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.variant})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price}</td>
      </tr>
    `).join("");

    const emailSubject = `New Order Received: #${createdOrder._id}`;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #be1e2d; margin-top: 0;">New Spice Order!</h2>
        <p><strong>Customer:</strong> ${customer_name} (${customer_email})</p>
        <p><strong>Phone:</strong> ${customer_phone}</p>
        <p><strong>Total Amount:</strong> ₹${total_amount}</p>
        
        <h3 style="border-bottom: 2px solid #be1e2d; padding-bottom: 5px;">Shipping Address</h3>
        <p>${address}, ${city}, ${state} - ${pincode}</p>

        <h3 style="border-bottom: 2px solid #be1e2d; padding-bottom: 5px;">Order Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: left;">Qty</th>
              <th style="padding: 10px; text-align: left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
        </table>
        
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Order logged in Admin Dashboard.</p>
      </div>
    `;

    // Fire and forget (don't block response)
    sendEmail("aaryan.b.rathod99@gmail.com", emailSubject, emailHtml).catch(err => console.error("Order notification failed:", err));

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ customer_email: req.user.email });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
};
