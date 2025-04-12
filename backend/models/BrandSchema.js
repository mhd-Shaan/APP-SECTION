import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Category image is required"],
    },
    type:{
      type:String,
      required:true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Brands = mongoose.model("brands", brandSchema);

export default Brands;