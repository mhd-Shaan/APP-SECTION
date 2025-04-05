import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  userType: { type: String, enum: ["user", "admin"], required: true }, 
  expiresAt: { type: Date, required: true },

});

const OtpVerification = mongoose.model("OTPVerification", otpSchema);

export default OtpVerification