import nodemailer from "nodemailer";
import crypto from "crypto";
import OtpVerification from '../models/otpschema.js'

export const sendOTP = async (email, type) => {
  if (!email) throw new Error("Email is required");
  if (!type) throw new Error("OTP type is required (user/store)");

  const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 mins

  await OtpVerification.create({ email, otp, type, expiresAt }); // Make sure type is saved

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
  });

  return { message: "OTP sent to email" };
};

