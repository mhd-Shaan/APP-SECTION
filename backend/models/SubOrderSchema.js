import mongoose from "mongoose";

const subOrderSchema = new mongoose.Schema({
  parentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  store: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true },

  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      image: String,
      price: Number,
      quantity: Number,
    }
  ],

  orderStatus: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing"
  },

  // Location for assigning nearest rider
 storeLocation: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },

  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryRegistration" },
  assignedAt: Date,

}, { timestamps: true });

subOrderSchema.index({ storeLocation: "2dsphere" });

export default mongoose.model("SubOrder", subOrderSchema);
