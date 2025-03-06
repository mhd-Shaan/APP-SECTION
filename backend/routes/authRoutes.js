import express from 'express';
import {registerUser,verifyOTP,loginUsers} from '../controllers/authController.js'

const router = express.Router();


router.post('/registeruser',registerUser)
router.post('/verify-otp', verifyOTP);  // Verify OTP & Activate Account
router.post('/loginusers',loginUsers)


export default router;

