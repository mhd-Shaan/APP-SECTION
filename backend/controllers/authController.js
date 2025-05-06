import Users from "../models/userSchema.js";
import OTPVerification from "../models/otpschema.js";
import authHelper from "../helpers/auth.js";
import { sendOTP } from "../helpers/emailService.js";
import Tempusers from "../models/tempuserschema.js";
import jwt from "jsonwebtoken";
import OtpVerification from "../models/otpschema.js";
import Location from "../models/LocationSchema.js";

const { hashPassword, comparePassword } = authHelper;

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name) return res.status(400).json({ error: "name is required" });
    if (!email) return res.status(400).json({ error: "email is required" });
    if (!password)
      return res.status(400).json({ error: "password is required" });

    if (password.length < 6) {
      return res.status(400).json({
        error: "password must be at least 6 characters long ",
      });
    }

    const existingemail = await Users.findOne({ email });
    if (existingemail)
      return res.status(400).json({ error: "email is already taken" });

    const exisitingtemp = await Tempusers.findOne({ email });
    if (exisitingtemp) {
      await Tempusers.deleteOne({ email });
    }

    const exisitingotp = await OTPVerification.findOne({ email });
    if (exisitingotp) {
      await OTPVerification.deleteOne({ email });
    }

    await sendOTP(email, "user");

    res
      .status(200)
      .json({ message: "OTP sent to email. Verify OTP to continue." });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, password, name } = req.body;
    

    if (!name) return res.status(400).json({ error: "name is required" });
    if (!email) return res.status(400).json({ error: "email is required" });
    if (!password)
      return res.status(400).json({ error: "password is required" });
    if (!otp) return res.status(400).json({ error: "otp is required" });

    const otpRecord = await OTPVerification.findOne({ email, userType: 'user' });

    const existingemail = await Users.findOne({ email });
    if (existingemail)
      return res.status(400).json({ error: "User is already taken" });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    const hashedPassword = await hashPassword(password);

    const newUser = await Users.create({
      email,
      password: hashedPassword,
      name,
    });
    await OTPVerification.deleteOne({ email });

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ error });
    console.log(error);
  }
};

export const loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: "email is required" });

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ error: "User is not exisiting" });

    if (!password)
      return res.status(400).json({ error: "password is required" });
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be at least 6 characters long" });
    }

    const match = await comparePassword(password, user.password);
    if (!match) res.status(400).json({ error: "Enter correct password" });

    jwt.sign({ id: user.id }, process.env.jwt_SECRET, {}, (err, token) => {
      if (err) throw err;

      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side JavaScript access
        secure: true, // Ensures cookies are sent only over HTTPS (set to false in development)
        sameSite: "Strict", // Helps prevent CSRF attacks
        maxAge: 3600000, // 1 hour expiry
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
    });
  } catch (error) {
    console.log(error);
  }
};





export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.User);
  } catch (error) {
    console.log("error from checkAuth", error.message);
    res.status(500).json({ msg: error.message });
  }
};




export const Otpsend = async(req,res)=>{
  try {
    const {email}=req.body
    if(!email) return res.status(400).json({error:"email is required"})

      const admin = await Users.findOne({email });
      if (!admin) {
        return res.status(404).json({ error: "this email is not registred" });
    }
    const otpsend = await OTPVerification.findOne({email})
    if(otpsend){
      await OTPVerification.deleteOne({ email });
    }
    await sendOTP(email,"user");
    res.status(200).json({ message: "otp sended" });

  } catch (error) {
    console.error("Error send otp :", error);
      res.status(500).json({ error });
  }
}

export const CheckingOtp=async(req,res)=>{
  try {
    const {email,otp}=req.body

    console.log(email,otp);
    

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!otp) return res.status(400).json({ error: "OTP is required" });

    const otpRecord = await OTPVerification.findOne({ email });
    console.log(otpRecord.otp);
    

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP expired. Request a new one." });
    }

    if (otpRecord.otp !== otp)
      return res.status(400).json({ error: "Invalid OTP" });

    const updatedOtp = await OtpVerification.findOneAndUpdate(
      { email }, 
      { otpisverfied: true }, 
      { new: true } 
    );
    res.status(200).json({ message: " OTP verified successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP." });
    console.log(error);
  }
} 

export const updatePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required" });
    if (!password) return res.status(400).json({ error: "Enter a password" });
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    if (!confirmPassword) return res.status(400).json({ error: "Enter confirm password" });
    if (password !== confirmPassword) return res.status(400).json({ error: "Passwords do not match" });

    const User = await Users.findOne({ email });
    if (!User) {
      return res.status(404).json({ error: "This User is not registered" });
    }

    const otpchecking = await OtpVerification.findOne({ email, otpisverfied: true });

    if (!otpchecking) {
      return res.status(400).json({ error: "OTP  verification not completed" });
    }

    const hashedPassword = await hashPassword(password);

    User.password = hashedPassword;
    await User.save();

    await OtpVerification.deleteOne({ email });

    return res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.log("Error updating password:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const CityAdding = async (req, res) => {
  try {

    const userid = req.User._id
    const { city } = req.body;
    

    if (!city) {
      return res.status(400).json({ error: "City is required" });
    }

    if (!userid|| !req.User._id) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    const updatedUser = await Users.findByIdAndUpdate(
      userid,
      { city },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "City updated", user: updatedUser });
  } catch (error) {
    console.error("City update error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const ViewCity = async(req,res)=>{
  try {
    const viewcity = await Location.find()
    return res.status(200).json({ success: true, message: "City updated", viewcity });
  } catch (error) {
    console.log("City view error:", error);
    return res.status(500).json({error});
  }
}

export const saveemail = async (req, res) => {
    try {
      const {existingemail,email,otp}=req.body

      const otpchecking = await OtpVerification.findOne({ email:existingemail, otpisverfied: true });
      if (!otpchecking) {
return res.status(400).json({ error: "Existing email OTP  verification not completed" });
}
  
      if (!email) return res.status(400).json({ error: "Email is required" });
      if (!otp) return res.status(400).json({ error: "OTP is required" });
  
      const otpRecord = await OTPVerification.findOne({ email });
  
      if (!otpRecord || otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ error: "OTP expired. Request a new one." });
      }
  
      if (otpRecord.otp !== otp)
        return res.status(400).json({ error: "Invalid OTP" });

  


      // const emailexist = await Users.findOne(existingemail)
  
      const updatedOtp = await Users.findOneAndUpdate(
        { email:existingemail }, 
        {email: email }, 
        { new: true } 
      );
      res.status(200).json({ message: " updatedemail successfully" });
  
    } catch (error) {
      res.status(500).json({ message: "Error verifying OTP." });
      console.log(error);
    }
  }


export const Editusers = async (req, res) => {
  try {
    const userId = req.User._id
    const { name } = req.body;

    // Find the admin in the database
    const User = await Users.findById(userId);
    if (!User) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }

    
    if (!name) return res.json({ error: "name is required" });

    if (name) {
      User.name = name;
    }

    await User.save();

    res.status(200).json({
      success: true,
      message: "Update successful",
      User,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const Otpsendemail = async(req,res)=>{
  try {
    const {email}=req.body
    if(!email) return res.status(400).json({error:"email is required"})

      const admin = await Users.findOne({email });
      if (admin) {
        return res.status(404).json({ error: "this email already registred" });
    }
    const otpsend = await OTPVerification.findOne({email})
    if(otpsend){
      await OTPVerification.deleteOne({ email });
    }
    await sendOTP(email,"user");
    res.status(200).json({ message: "otp sended" });

  } catch (error) {
    console.error("Error send otp :", error);
      res.status(500).json({ error });
  }
}