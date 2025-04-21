import jwt from "jsonwebtoken"
import Users from "../models/userSchema.js";

const protectRouteuser = async (req, res, next) => {
  console.log("protectRoute middleware triggered");

  try {
    
    const token = req.cookies?.token// Ensure token is read properly
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized: No token found" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Unauthorized: Invalid token" });
    }

const Userdata = await Users.findById(decoded.id)
  req.User = Userdata;

      next();

  } catch (error) {
    console.error("Error from protectRoute:", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export { protectRouteuser };
