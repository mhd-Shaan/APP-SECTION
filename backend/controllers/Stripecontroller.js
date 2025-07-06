import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/OrdersSchema.js';
import Address from '../models/AddressSchema.js';
import Users from '../models/userSchema.js';


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order and initiate payment
export const createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice } = req.body;
    

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ error: "Invalid total price" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice*100),
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log("Stripe PaymentIntent Error:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
};

// 2. Create Order for COD or Successful Stripe Payment
export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      userId,
      paymentInfo,
      paymentStatus,
    } = req.body;

    

    if (!orderItems || !shippingAddress || !paymentMethod || !totalPrice || !userId) {
      return res.status(400).json({ error: "Missing order fields" });
    }

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentStatus: paymentMethod === "card" ? (paymentStatus || "paid") : "pending",
      paymentInfo: paymentMethod === "card" && paymentInfo ? paymentInfo : {},
    });

    const createdOrder = await order.save();

    res.status(201).json({ message: "Order created", orderId: createdOrder._id });
  } catch (error) {
    console.log("Order Creation Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};


// Add new address
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      pincode,
      houseNumber,
      address,
      landmark,
      city,
      addressType,
    } = req.body;

    console.log(req.body);
    
    const newAddress = new Address({
      user: req.User._id,
      fullName,
      phone,
      pincode,
      houseNumber,
      address,
      landmark,
      city,
      addressType,
    });

    await Users.findByIdAndUpdate(req.User._id, {
  $push: { addresses: newAddress._id }
});

    await newAddress.save();

    res.status(201).json({ message: "Address saved successfully", address: newAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save address", error: error.message });
  }
};

// Get all addresses of the user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to get addresses", error: error.message });
  }
};

// Update address
export const updateAddress = async (req, res) => {
  try {
  
    console.log(req.body);
    
    
    const address = await Address.findOne({ _id: req.params.id, user: req.User._id });

    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body); // update fields
    await address.save();

    res.status(200).json({ message: "Address updated", address });
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error: error.message });
    console.log(error);
    
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {

    
    
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.User._id });

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};


export const orders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.User._id }).populate('orderItems.product')

    if (!orders) return res.status(404).json({ message: "orders not found" });

    res.status(200).json({ orders});
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Failed to show orders", error: error.message });
  }
};


export default router;
