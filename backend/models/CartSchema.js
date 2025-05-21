import mongoose from "mongoose";
import { type } from "os";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Make sure this matches your Product model
    required: true,
  },
  brand:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"brands"
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  priceAtAddTime: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },
  items: [cartItemSchema],
}, {
  timestamps: true, 
});

 const Cart = mongoose.model("Cart", cartSchema);
 export default Cart
