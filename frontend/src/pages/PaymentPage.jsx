import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const API_URL = "http://localhost:5000";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const [addresses, setAddresses] = useState(user?.user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [deliveryType, setDeliveryType] = useState("courier"); // default
  const [assigningDelivery, setAssigningDelivery] = useState(false); // ⭐ NEW

  const amount = location.state?.amount || 0;
  const orderItems = location.state?.cartItems || [];
  const orderTotal = amount;
  const deliveryFee = 0.0;
  const subtotal = (parseFloat(orderTotal) + deliveryFee).toFixed(2);

  // Check if Quick Delivery is available
  const isQuickAvailable = () => {
    if (!selectedAddress || orderItems.length === 0) return false;
    const userCity = selectedAddress.city?.trim().toLowerCase();
    const storeCity = user?.user?.city?.trim().toLowerCase();
    return userCity === storeCity;
  };

  // Build order payload
  const buildOrderPayload = (paymentIntent = null) => ({
    orderItems: orderItems.map((item) => ({
      product: item.product?._id || item._id,
      name: item.productName || item.name,
      image: item.images || item.image,
      price: item.price,
      quantity: item.quantity,
    })),
    shippingAddress: selectedAddress,
    paymentMethod,
    itemsPrice: parseFloat(orderTotal),
    shippingPrice: deliveryFee,
    totalPrice: subtotal,
    userId: user?.user?._id,
    deliveryType,
    ...(paymentIntent && {
      paymentInfo: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        paidAt: new Date(),
      },
      paymentStatus: "paid",
    }),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) return toast.error("Select a delivery address");

    setProcessing(true);

    try {
      let orderResponse = null;

      // Show assigning modal for Quick Delivery
      if (deliveryType === "quick") setAssigningDelivery(true);

      // 🟡 CARD PAYMENT
      if (paymentMethod === "card") {
        const paymentIntentResponse = await axios.post(
          `${API_URL}/create-payment-intent`,
          { totalPrice: amount },
          { withCredentials: true }
        );

        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          paymentIntentResponse.data.clientSecret,
          {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: selectedAddress.fullName,
                address: {
                  line1: selectedAddress.houseNumber,
                  line2: selectedAddress.address,
                  city: selectedAddress.city,
                  postal_code: selectedAddress.pincode,
                },
              },
            },
          }
        );

        if (error) throw error;

        if (paymentIntent.status === "succeeded") {
          const orderPayload = buildOrderPayload(paymentIntent);
          orderResponse = await axios.post(`${API_URL}/create-order`, orderPayload, {
            withCredentials: true,
          });
          toast.success("Payment successful!");
        }
      } 
      // 🟢 CASH ON DELIVERY
      else {
        const orderPayload = buildOrderPayload();
        orderResponse = await axios.post(`${API_URL}/create-order`, orderPayload, {
          withCredentials: true,
        });
        toast.success("Order placed successfully!");
      }

      // ⭐ Handle auto-assignment feedback
      if (deliveryType === "quick") {
        const assigned = orderResponse.data.partners[0]; // first store
        if (!assigned?.assigned) {
          toast.error(
            "No delivery partner available. Your order is placed and waiting for assignment."
          );
        } else {
          toast.success(`Delivery partner assigned: ${assigned.partnerName}`);
        }
      }

      navigate("/success", { state: { orderId: orderResponse.data.orders[0]._id } });
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.error || "Payment failed");
    } finally {
      setProcessing(false);
      setAssigningDelivery(false);
    }
  };

  if (!amount || orderItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 max-w-2xl mt-14">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Checkout</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ADDRESS SECTION */}
            <div className="space-y-3">
              <h3 className="font-medium">Delivery Address</h3>
              {addresses.map((address) => (
                <div
                  key={address._id}
                  className={`border rounded p-3 ${
                    selectedAddress?._id === address._id ? "border-blue-500" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{address.fullName}</p>
                      <p className="text-sm">
                        {address.houseNumber}, {address.address}, {address.city} -{" "}
                        {address.pincode}
                      </p>
                      <p className="text-sm">Phone: {address.phone}</p>
                    </div>
                    <Button
                      variant={selectedAddress?._id === address._id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAddress(address)}
                    >
                      {selectedAddress?._id === address._id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* DELIVERY OPTION SECTION */}
            <div className="space-y-3">
              <h3 className="font-medium">Delivery Type</h3>

              {/* QUICK DELIVERY */}
              <label
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                  !isQuickAvailable() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="radio"
                  value="quick"
                  disabled={!isQuickAvailable()}
                  checked={deliveryType === "quick"}
                  onChange={() => isQuickAvailable() && setDeliveryType("quick")}
                />
                <div>
                  <p className="font-semibold">Quick Delivery</p>
                  <p className="text-sm text-gray-500">Fast delivery inside your city only</p>
                </div>
              </label>

              {/* COURIER DELIVERY */}
              <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  value="courier"
                  checked={deliveryType === "courier"}
                  onChange={() => setDeliveryType("courier")}
                />
                <div>
                  <p className="font-semibold">Courier Delivery</p>
                  <p className="text-sm text-gray-500">Available anywhere in Kerala</p>
                </div>
              </label>
            </div>

            {/* PAYMENT METHOD */}
            <div className="space-y-3">
              <h3 className="font-medium">Payment Method</h3>
              <div className="flex gap-4">
                <Button
                  variant={paymentMethod === "card" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("card")}
                >
                  Card
                </Button>
                <Button
                  variant={paymentMethod === "cod" ? "default" : "outline"}
                  onClick={() => setPaymentMethod("cod")}
                >
                  Cash on Delivery
                </Button>
              </div>

              {paymentMethod === "card" && (
                <div className="border rounded p-3">
                  <CardElement
                    options={{
                      style: { base: { fontSize: "16px", color: "#424770" } },
                    }}
                  />
                </div>
              )}
            </div>

            {/* ORDER SUMMARY */}
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              <div className="flex justify-between">
                <span>Items</span>
                <span>₹{orderTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{subtotal}</span>
              </div>
            </div>

            {/* FINAL BUTTON */}
            <Button
              className="w-full bg-yellow-500 text-white rounded hover:bg-yellow-600"
              onClick={handleSubmit}
              disabled={processing || !selectedAddress}
            >
              {processing ? "Processing..." : `Place Order - ₹${subtotal}`}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 🔵 QUICK DELIVERY LOADING MODAL */}
      {assigningDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-2">Assigning Delivery Partner...</h2>
            <p>Please wait while we find a delivery boy near your location.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default PaymentPage;
