import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import order from '../models/OrdersSchema.js';
import Address from '../models/AddressSchema.js';


const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create order and initiate payment
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    userId, 
  } = req.body;

  try {
    // 1. Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100), // Stripe uses paise
      currency: 'inr',
      automatic_payment_methods: { enabled: true },
    });

    // 2. Create order in DB with "Pending" payment status
    const newOrder = new order({
      user: userId, // or use req.user._id if using auth middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paymentStatus: 'Pending',
      paymentIntentId: paymentIntent.id,
    });

    const savedOrder = await newOrder.save();

    // 3. Return client secret to frontend
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      orderId: savedOrder._id,
    });
  } catch (error) {
    console.log('Stripe/Order error:', error);
    res.status(500).send({ error: 'Order creation or payment failed' });
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
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });

    if (!address) return res.status(404).json({ message: "Address not found" });

    Object.assign(address, req.body); // update fields
    await address.save();

    res.status(200).json({ message: "Address updated", address });
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error: error.message });
  }
};


export default router;
