import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  GSTIN: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
  shopName: {
    type: String,
  },
  pickupDetails: {
    shopName:{
      type:String,
    },
    pickupCode: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  storeDescription: {
    type: String,
  },
  documentImage: {
    type: String, // Store image URL or file path
  },
  isBlocked: {
    type: Boolean,
    default: false, // Store is not blocked by default
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending", // Default status is pending
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 const Stores =  mongoose.model("Stores", storeSchema);
 export default Stores
