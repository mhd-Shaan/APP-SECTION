import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String },
        image: { type: String },
        price: { type: Number },
        quantity: { type: Number, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      mobileNumber: { type: String},
      pincode: { type: String, required: true },
      flat: { type: String },
      houseNumber: { type: String },
      address: { type: String, required: true }, 
      landmark: { type: String },
      city: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['card', 'cod'], 
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentInfo: {
      id: String, 
      status: String,
      paidAt: Date,
    },
    itemsPrice: { type: Number, required: true },
    taxPrice: { type: Number},
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },

    orderStatus: {
      type: String,
      default: 'Processing',
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model('Order', orderSchema);
export default order