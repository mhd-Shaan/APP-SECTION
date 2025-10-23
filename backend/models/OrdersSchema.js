import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      image: String,
      price: Number,
      quantity: { type: Number, required: true },
    },
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    mobileNumber: String,
    pincode: { type: String, required: true },
    flat: String,
    houseNumber: String,
    address: { type: String, required: true },
    landmark: String,
    city: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true, enum: ["card","cod"] },
  paymentStatus: { type: String, enum: ["pending","paid","failed"], default: "pending" },
  paymentInfo: { id: String, status: String, paidAt: Date },
  itemsPrice: { type: Number, required: true },
  taxPrice: Number,
  shippingPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date,
  orderStatus: { type: String, enum: ["Processing","Shipped","Delivered","Cancelled"], default: "Processing" },

  // ✅ Delivery Assignment Tracking
  assignedPartner: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoyRegistration" },
  assignedAt: Date,

  // Optional: store location for auto-assignment
  storeLocation: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;