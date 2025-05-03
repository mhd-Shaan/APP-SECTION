import mongoose from "mongoose";

const storeSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    sparse:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  GSTIN: {
    type: String,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
  pannumber: {
    type: String,
  },
  city:{
    type:String
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
  pdfUrls: [{ type: String }], 
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