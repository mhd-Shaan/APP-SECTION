import Users from "../models/userSchema.js";
import OTPVerification from "../models/otpschema.js";
import authHelper from "../helpers/auth.js";
import { sendOTP } from "../helpers/emailService.js";
import Tempusers from "../models/tempuserschema.js";
import jwt from "jsonwebtoken";

const { hashPassword, comparePassword } = authHelper;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return  res.status(400).json({ error: "name is required" });
    if (!email) return  res.status(400).json({ error: "email is required" });
    if (!password) return  res.status(400).json({ error: "password is required" });

    if (password.length < 6) {
      return res.status(400).json({
        error: "password must be at least 6 characters long ",
      });
    }

    const existingemail = await Users.findOne({ email });
    if (existingemail) return  res.status(400).json({ error: "email is already taken" });

    const exisitingtemp = await Tempusers.findOne({ email });
    if (exisitingtemp) {
      await Tempusers.deleteOne({ email });
    }

    const exisitingotp = await OTPVerification.findOne({ email });
    if (exisitingotp) {
      await OTPVerification.deleteOne({ email });
    }

    await sendOTP(email, "user");

    const hashedPassword = await hashPassword(password);
    const tempuser = await Tempusers.create({ email, name,password:hashedPassword });

    res
      .status(200)
      .json({ message: "OTP sent to email. Verify OTP to continue." });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) return  res.status(400).json({ error: "email is required" });
    if (!otp) return  res.status(400).json({ error: "otp is required" });

    // Find user by email
    const otpRecord = await OTPVerification.findOne({ email });
    const tempuser = await Tempusers.findOne({ email });

    const existingemail = await Users.findOne({ email });
    if (existingemail) return  res.status(400).json({ error: "User is already taken" });


    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    // Create User after successful OTP verification
    const newUser = await Users.create({
      email,
      password: tempuser.password,
      name: tempuser.name,
    });
    await OTPVerification.deleteOne({ email }); // Remove OTP record
    await Tempusers.deleteOne({ email });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const loginUsers = async (req,res)=>{
  try {
    const {email,password}=req.body

    if (!email) return  res.status(400).json({ error: "email is required" });


    const user = await Users.findOne({email})
    if(!user) return  res.status(400).json({error:"User is not exisiting"})

     if (!password) return  res.status(400).json({ error: "password is required" });
    if (!password || password.length < 6) {
      return  res.status(400).json({ error: "password must be at least 6 characters long" });
    }
    
 const match = await comparePassword(password,user.password)
 if(!match)  res.status(400).json({error:"Enter correct password"})
    
  jwt.sign({id:user.id},process.env.jwt_SECRET,{},(err,token)=>{
    if(err) throw err;


    res.cookie("token", token, {
      httpOnly: true,   // Prevents client-side JavaScript access
      secure: true,     // Ensures cookies are sent only over HTTPS (set to false in development)
      sameSite: "Strict", // Helps prevent CSRF attacks
      maxAge: 3600000,  // 1 hour expiry
  });

    res.status(200).json({
      success: true,
      message: "Login successful",
      userdetails: {
          id: user._id,
          name: user.name,
          email: user.email,
      },
      token,
  });
  })
  

   
  } catch (error) {
    console.log(error);
    
  }

}

export const checkAuth = (req, res) => {
  try {
    console.log("controll", req.User);
    res.status(200).json(req.User);
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};