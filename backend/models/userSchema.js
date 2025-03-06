import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    address: { type: String },
    profileImage: { type: String }, // URL to the profile image
    isBlocked: {
      type: Boolean,
      default: false,
    }
   
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users
