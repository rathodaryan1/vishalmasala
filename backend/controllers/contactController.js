const sendEmail = require("../utils/sendEmail");

// @desc    Submit contact form and send email
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Email to Admin
    const emailSubject = `New Contact Form: ${subject || "General Inquiry"}`;
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #be1e2d;">New Message from Vishal Masala Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</p>
      </div>
    `;

    const result = await sendEmail("aaryan.b.rathod99@gmail.com", emailSubject, emailHtml);

    if (result.success) {
      res.status(200).json({ success: true, message: "Message sent! We'll get back to you soon." });
    } else {
      // Still return 200 to user but log error for admin
      console.error("Failed to send contact email:", result.error);
      res.status(200).json({ success: true, message: "Message received! (Notification delivery pending)" });
    }
  } catch (error) {
    console.error("CONTACT_SUBMIT_ERROR:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { submitContactForm };
