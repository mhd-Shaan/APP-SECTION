import mongoose from "mongoose";
import { type } from "os";

const productSchema = new mongoose.Schema(
  {
    storeid:{
      type:String,
    },
    vehicleType: {
      type: String,
      required: true,
     // enum: ["2-Wheeler", "4-Wheeler", "Commercial Vehicle"],
    },
    vehicleBrand: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    partType: {
      type: String,
      required: true,
    },
    spareBrand: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true,
    },
    isBlock:{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

const Product = mongoose.model("Product", productSchema);

export default Product;