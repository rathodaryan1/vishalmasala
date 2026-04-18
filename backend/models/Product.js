const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
});

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    highlights: { type: [String], required: true },
    isOffer: { type: Boolean, default: false },
    badge: { type: String },
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
