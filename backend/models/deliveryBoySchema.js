import mongoose from "mongoose";

const deliveryBoySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true, unique: true },
  password: { type: String }, // Login password
  emailVerified: { type: Boolean, default: false },

  dob: { type: Date },
  gender: { type: String, enum: ["male", "female"] },

  licenseNumber: { type: String },
  licenseImage: { type: [String] },

  district: { type: String },
  pincode: { type: String },
  photo: { type: String }, // Cloudinary URL
  address: { type: String },
maxActiveOrders: { type: Number, default: 2 },

// Track his current delivery load
activeOrdersCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "blocked"],
    default: "pending",
  },

  isBlocked: { type: Boolean, default: false },
  isOnline: { type: Boolean, default: false },

  // ✅ GeoJSON location for finding nearest delivery boy
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },

  // ✅ If currently delivering
  currentOrder: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },

  createdAt: { type: Date, default: Date.now },
});

deliveryBoySchema.index({ location: "2dsphere" });

const DeliveryRegistration = mongoose.model(
  "DeliveryBoyRegistration",
  deliveryBoySchema
);

export default DeliveryRegistration;