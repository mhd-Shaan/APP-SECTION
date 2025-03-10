import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ["user", "store"], required: true }, // NEW: Identifies OTP type
  expiresAt: { type: Date, required: true },

});

const OtpVerification = mongoose.model("OTPVerification", otpSchema);

export default OtpVerification