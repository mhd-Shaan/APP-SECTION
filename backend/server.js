import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from './routes/authRoutes.js'
import cookieParser from "cookie-parser";
import storeRoutes from './routes/storeRoutes.js'

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Correct
  credentials: true
}));


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(cookieParser());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use('/',authRoutes)
app.use("/store", storeRoutes);


mongoose.connect(process.env.MONGO_URI, {})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('MongoDB connection error:', error));