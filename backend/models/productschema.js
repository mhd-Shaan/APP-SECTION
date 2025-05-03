

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // storeid: {
    //   type: String,
    //   required: true,
    // },
    vehicleType: {
      type: String,
      required: true,
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    subcategory: {
      type: String,
      required: true,
    },
    brandType: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'brands',
    },
    store:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stores',
    },
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    warranty: {
      type: String,
      default: "",
    },
    features: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      required: true,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;