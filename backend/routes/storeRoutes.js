import express from 'express';
import {protectRouteuser} from '../middleware/authmiddleware.js'
import {  otpsending, StoreLogin, StoreRegestration1, StoreRegestration2, StoreRegestration3, verifyOTPforStore } from '../controllers/storeController.js';

const router = express.Router();

router.post("/register1",StoreRegestration1)
router.post("/otp-verificaton",verifyOTPforStore)
router.post("/otp-number",otpsending)
router.post("/register2/:id",StoreRegestration2)
router.post("/register3/:id",StoreRegestration3)
router.post('/loginstore',StoreLogin)
export default router;
