import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/OrdersSchema.js';
import Address from '../models/AddressSchema.js';
import Users from '../models/userSchema.js';
import Product from '../models/productschema.js';
import Stores from '../models/StoreSchema.js';
import DeliveryRegistration from "../models/deliveryBoySchema.js";


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

    if (!orderItems?.length || !shippingAddress || !paymentMethod || !totalPrice || !userId) {
      return res.status(400).json({ error: "Missing order fields" });
    }

    const validatedOrderItems = [];
    let storeLocation = null;

    for (const item of orderItems) {
      // ✅ Populate store to get shopName, city, pickupDetails
      const product = await Product.findById(item.product).populate("store");

      if (!product)
        return res.status(400).json({ error: `Product not found: ${item.product}` });

      if (product.stockQuantity < item.quantity)
        return res.status(400).json({ error: `Insufficient stock for ${product.productName}` });

      // Reduce product stock
      product.stockQuantity -= item.quantity;
      await product.save();

      // Push enriched order item
      validatedOrderItems.push({
        product: product._id,
        name: product.productName,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: item.quantity,
        store: product.store?._id,
        storeName: product.store?.shopName,
        storeCity: product.store?.city,
      });

      // ✅ Safely access pickupDetails.location
      const pickupDetails = product.store?.pickupDetails?.toObject?.() || product.store?.pickupDetails;
      
      if (pickupDetails?.location?.coordinates) {
        storeLocation = {
          type: "Point",
          coordinates: pickupDetails.location.coordinates,
        };
      }
    }

    // ✅ Create the order
    const order = new Order({
      user: userId,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentStatus: paymentMethod === "card" ? paymentStatus || "paid" : "pending",
      paymentInfo: paymentMethod === "card" && paymentInfo ? paymentInfo : {},
      storeLocation, // For delivery assignment
    });

    const createdOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      orderId: createdOrder._id,
      orderItems: validatedOrderItems,
      storeLocation,
    });
  } catch (error) {
    console.log("Order Creation Error:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
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




export const autoAssignDeliveryBoy = async (req, res) => {
  try {
    const { orderId } = req.params;

    // 1️⃣ Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (!order.storeLocation?.coordinates) {
      return res.status(400).json({ success: false, message: "Store location missing in order" });
    }
    


    // 2️⃣ Find nearest available & approved delivery partner
    const nearestPartner = await DeliveryRegistration.findOne({
      isOnline: true,
      isBlocked: false,
      status: "approved",
      $expr: { $lt: ["$activeOrdersCount", "$maxActiveOrders"] }, // ✅ fixed comparison
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: order.storeLocation.coordinates, // [lng, lat]
          },
          $maxDistance: 10000, // within 10 km
        },
      },
    });
console.log(nearestPartner);

    if (!nearestPartner) {
      return res.status(404).json({
        success: false,
        message: "No delivery partners available nearby",
      });
    }

    // 3️⃣ Assign delivery partner to the order
    order.assignedPartner = nearestPartner._id;
    order.assignedAt = new Date();
    order.orderStatus = "Shipped";
    await order.save();

    // 4️⃣ Update delivery partner’s active order count
    nearestPartner.activeOrdersCount += 1;
    nearestPartner.currentOrder = order._id;
    await nearestPartner.save();

    res.status(200).json({
      success: true,
      message: `Order assigned to ${nearestPartner.fullName}`,
      partnerId: nearestPartner._id,
      orderId: order._id,
    });
  } catch (error) {
    console.log("Auto Assign Error:", error);
    res.status(500).json({ success: false, message: "Failed to auto assign partner" });
  }
};


export default router;
