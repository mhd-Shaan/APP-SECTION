import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import Order from '../models/OrdersSchema.js';
import Address from '../models/AddressSchema.js';
import Users from '../models/userSchema.js';
import Product from '../models/productschema.js';
import Stores from '../models/StoreSchema.js';
import DeliveryRegistration from "../models/deliveryBoySchema.js";

// import { autoAssignDeliveryBoy } from "./autoAssignDeliveryBoy.js"; // Make sure correct path

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



// export const createOrder = async (req, res) => {
//   try {
//     const {
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       userId,
//       paymentInfo,
//       paymentStatus,
//     } = req.body;

//     if (!orderItems?.length) {
//       return res.status(400).json({ error: "Order items required" });
//     }

//     // 1️⃣ Group order items based on store
//     const itemsByStore = {};

//     for (const item of orderItems) {
//       const product = await Product.findById(item.product).populate("store");

//       if (!product) continue;
//       if (product.stockQuantity < item.quantity)
//         return res.status(400).json({ error: `Stock not available for ${product.productName}` });

//       // Update product stock
//       product.stockQuantity -= item.quantity;
//       await product.save();

//       const storeId = product.store._id.toString();

//       if (!itemsByStore[storeId]) {
//         itemsByStore[storeId] = {
//           store: product.store,
//           items: [],
//         };
//       }

//       itemsByStore[storeId].items.push({
//         product: product._id,
//         name: product.productName,
//         image: product.images?.[0] || "",
//         price: product.price,
//         quantity: item.quantity
//       });
//     }

//     const createdOrders = [];

//     // 2️⃣ Create separate order for each store
//     for (const storeId in itemsByStore) {
//       const storeDetails = itemsByStore[storeId];

//       const order = new Order({
//         user: userId,
//         orderItems: storeDetails.items,
//         shippingAddress,
//         paymentMethod,
//         itemsPrice,
//         shippingPrice,
//         totalPrice,
//         paymentStatus: paymentMethod === "card" ? paymentStatus || "paid" : "pending",
//         paymentInfo: paymentMethod === "card" ? paymentInfo : {},
//         storeLocation: storeDetails.store?.pickupDetails?.location,
//       });

//       const saved = await order.save();
//       createdOrders.push(saved);

//     }

//     res.status(201).json({
//       success: true,
//       message: "Orders created successfully",
//       orderIds: createdOrders.map(o => o._id), // return all order ids
//       orders: createdOrders,
//     });

//   } catch (error) {
//     console.error("Order Create Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };



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
      deliveryType
    } = req.body;
// console.log(req.body);

    if (!orderItems?.length)
      return res.status(400).json({ error: "Order items required" });

    const itemsByStore = {};
    const productsToUpdate = []; // <-- Track stock updates for later

    // STEP 1: Group items by store (but DO NOT reduce stock)
    for (const item of orderItems) {
      const product = await Product.findById(item.product).populate("store");
      console.log(product);
      
      if (!product) continue;

      if (product.stockQuantity < item.quantity)
        return res.status(400).json({
          error: `Stock not available for ${product.productName}`
        });

      // Save product + quantity for later stock update
      productsToUpdate.push({ product, quantity: item.quantity });

      const storeId = product.store._id.toString();

      if (!itemsByStore[storeId]) {
        itemsByStore[storeId] = { store: product.store, items: [] };
      }

      itemsByStore[storeId].items.push({
        product: product._id,
        name: product.productName,
        image: product.images?.[0] || "",
        price: product.price,
        quantity: item.quantity,
      });
    }

    // STEP 2: QUICK DELIVERY PARTNER CHECK BEFORE ORDER CREATION
    if (deliveryType === "quick") {
      for (const storeId in itemsByStore) {
        const storeLoc = itemsByStore[storeId].store?.pickupDetails?.location;

        if (!storeLoc?.coordinates) {
          return res.status(400).json({
            error: "Store location missing for quick delivery"
          });
        }

        const partner = await DeliveryRegistration.findOne({
          isOnline: true,
          isBlocked: false,
          status: "approved",
          $expr: { $lt: ["$activeOrdersCount", "$maxActiveOrders"] },
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: storeLoc.coordinates },
              $maxDistance: 1000
            }
          }
        });
        

        const partner1 = await DeliveryRegistration.findOne({
          isOnline: true,
          isBlocked: false,
          status: "approved",
          $expr: { $lt: ["$activeOrdersCount", "$maxActiveOrders"] },
          // location: {
          //   $near: {
          //     $geometry: { type: "Point", coordinates: storeLoc.coordinates },
          //     $maxDistance: 10000
          //   }
          // }
        });
        console.log(storeLoc);
        
// console.log(partner1);

        if (!partner) {
          return res.status(400).json({
            error: "No Delivery Partner Available for Quick Delivery right now. Please try normal delivery."
          });
        }
      }
    }

    // STEP 3: All checks passed → Create orders
    const createdOrders = [];
    const assignedPartners = [];

    for (const storeId in itemsByStore) {
      const storeLoc = itemsByStore[storeId].store?.pickupDetails?.location;

      const order = new Order({
        user: userId,
        orderItems: itemsByStore[storeId].items,
        deliveryType,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentStatus: paymentMethod === "card" ? paymentStatus || "paid" : "pending",
        paymentInfo: paymentMethod === "card" ? paymentInfo : {},
        storeLocation: storeLoc,
        orderStatus:
          deliveryType === "quick" ? "Searching for Delivery Partner" : "Pending",
      });

      const savedOrder = await order.save();
      createdOrders.push(savedOrder);

      let assigned = null;
      if (deliveryType === "quick") {
        assigned = await autoAssignDeliveryBoy(savedOrder._id, {
          maxWaitTime: 60000,
        });
      }

      assignedPartners.push(assigned);
    }

    // STEP 4: Update product stock ONLY after order is fully created
    for (const { product, quantity } of productsToUpdate) {
      product.stockQuantity -= quantity;
      await product.save();
    }

    return res.status(201).json({
      success: true,
      message: "Order created",
      orders: createdOrders,
      partners: assignedPartners,
    });

  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ error: error.message });
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


export const autoAssignDeliveryBoy = async (orderId, options = {}) => {
  try {
    const { maxWaitTime = 60000, interval = 5000 } = options;

    const order = await Order.findById(orderId);
    if (!order) {
      console.log("❌ Order not found");
      return { possible: false, message: "Order not found" };
    }

    if (!order.storeLocation?.coordinates) {
      console.log("❌ Store location missing");
      return { possible: false, message: "Store location missing" };
    }

    const startTime = Date.now();
    const radiusSteps = [2000, 5000, 8000, 12000, 20000]; // meters

    while (Date.now() - startTime < maxWaitTime) {
      for (const maxDistance of radiusSteps) {
        const partner = await DeliveryRegistration.findOne({
          isOnline: true,
          isBlocked: false,
          status: "approved",
          $expr: { $lt: ["$activeOrdersCount", "$maxActiveOrders"] },
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: order.storeLocation.coordinates,
              },
              $maxDistance: maxDistance,
            },
          },
        });

        if (partner) {
          // Assign partner
          order.assignedPartner = partner._id;
          order.orderStatus = "Shipped";
          order.assignedAt = new Date();
          await order.save();

          partner.currentOrders.push(order._id);
          partner.activeOrdersCount += 1;
          await partner.save();

          return {
            possible: true,
            assigned: true,
            partnerId: partner._id,
            partnerName: partner.fullName,
            orderId: order._id,
          };
        }
      }

      // Wait interval before retrying
      await new Promise((resolve) => setTimeout(resolve, interval));
    }

    // No partner found after maxWaitTime
    order.orderStatus = "No Delivery Partner Available";
    await order.save();

    return {
      possible: false,
      assigned: false,
      message: "No delivery partner found after waiting",
      orderId: order._id,
    };
  } catch (error) {
    console.error("Auto Assign Error:", error);
    return { possible: false, message: "Error assigning delivery partner" };
  }
};





// export const autoAssignDeliveryBoy = async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // 1️⃣ Find order
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ success: false, message: "Order not found" });
//     }

//     if (!order.storeLocation?.coordinates) {
//       return res.status(400).json({ success: false, message: "Store location missing in order" });
//     }
//     console.log(order.storeLocation.coordinates);
    
// // const near = await DeliveryRegistration.findOne({
// //       isOnline: true,
// //       isBlocked: false,
// //   })
// // console.log(near);

//     // 2️⃣ Find nearest available & approved de
//     // livery partner
    
//     const nearestPartner = await DeliveryRegistration.findOne({
//       isOnline: true,
//       isBlocked: false,
//       status: "approved",
//       $expr: { $lt: ["$activeOrdersCount", "$maxActiveOrders"] }, // ✅ fixed comparison
//       location: {
//         $near: {
//           $geometry: {
//             type: "Point",
//             coordinates: order.storeLocation.coordinates, // [lng, lat]
//           },
//           $maxDistance: 10000, // within 10 km
//         },
//       },
//     });
// console.log(nearestPartner);

//     if (!nearestPartner) {
//       return res.status(404).json({
//         success: false,
//         message: "No delivery partners available nearby",
//       });
//     }

//     // 3️⃣ Assign delivery partner to the order
//     order.assignedPartner = nearestPartner._id;
//     order.assignedAt = new Date();
//     order.orderStatus = "Shipped";
//     await order.save();

//     // 4️⃣ Update delivery partner’s active order count
//     nearestPartner.activeOrdersCount += 1;
//     nearestPartner.currentOrder = order._id;
//     await nearestPartner.save();

//     res.status(200).json({
//       success: true,
//       message: `Order assigned to ${nearestPartner.fullName}`,
//       partnerId: nearestPartner._id,
//       orderId: order._id,
//     });
//   } catch (error) {
//     console.log("Auto Assign Error:", error);
//     res.status(500).json({ success: false, message: "Failed to auto assign partner" });
//   }
// };


export default router;
