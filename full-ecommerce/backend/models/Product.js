const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["men", "women", "kids", "accessories"],
  },
  sizes: [
    {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
  ],
  colors: [
    {
      type: String,
    },
  ],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
