import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  pincode: { type: String, required: true },
  houseNumber: { type: String },
  address: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  addressType: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
}, { timestamps: true });

const Address = mongoose.model("Address", addressSchema);
export default Address;
