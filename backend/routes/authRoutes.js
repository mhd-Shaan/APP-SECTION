import express from 'express';
import {registerUser,verifyOTP,loginUsers,checkAuth, Otpsend, CheckingOtp, updatePassword} from '../controllers/authController.js'
import {protectRouteuser} from '../middleware/authmiddleware.js'
import { addcart, addwishlist, brandsshow, categoryshow, deletewishlist, productview, productviewbyid, removeCartItem, showwishlist, SubCategoryShow, viewCart } from '../controllers/productController.js';

const router = express.Router();


router.post('/registeruser',registerUser)
router.post('/verify-otp', verifyOTP);  
router.post('/loginusers',loginUsers)
router.get('/userdetails',protectRouteuser,checkAuth)
router.get('/products',productview)
router.get('/category',categoryshow)
router.get('/brands',brandsshow)
router.get('/subcategory/:id', SubCategoryShow)
router.post('/addwishlist',protectRouteuser,addwishlist)
router.get('/viewwishlist',protectRouteuser,showwishlist)
router.delete('/deletewishlist/:id',protectRouteuser, deletewishlist);
router.post('/addcart',protectRouteuser,addcart)
router.get('/viewcart',protectRouteuser,viewCart)
// router.put('/updatecart/:id',protectRouteuser,updateCartItem)
router.delete('/deletecart/:id',protectRouteuser,removeCartItem)
router.get('/productdetails/:id',productviewbyid)

router.post('/forget-password-otp',Otpsend)
router.post('/forgetpassword-verify-otp', CheckingOtp);  
router.put('/passwordupdate',updatePassword)



export default router;

