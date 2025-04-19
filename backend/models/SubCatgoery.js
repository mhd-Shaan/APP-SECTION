import mongoose from "mongoose";

const SubCategorySchema = new mongoose.Schema(
  {
    CategoryId:{
        type:String,
        required:true
    },
    name: {
      type: String,
      required: [true, "SubBrand name is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "SubBrand image is required"],
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

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

export default SubCategory;