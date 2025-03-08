import mongoose from "mongoose";

const tempstoreSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  isOTPVerified:
   { type: Boolean,
     default: false 
    }, // ✅ Add this field
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

 const Tempstoresschema =  mongoose.model("TempStores", tempstoreSchema);
 export default Tempstoresschema
