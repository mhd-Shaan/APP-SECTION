import express from 'express';
import {registerUser,verifyOTP,loginUsers,checkAuth} from '../controllers/authController.js'
import {protectRouteuser} from '../middleware/authmiddleware.js'

const router = express.Router();


router.post('/registeruser',registerUser)
router.post('/verify-otp', verifyOTP);  // Verify OTP & Activate Account
router.post('/loginusers',loginUsers)
router.get('/userdetails',protectRouteuser,checkAuth)

// router.post("/registerstore",StoreRegestration1)
export default router;

