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

  const amount = location.state?.amount || 0;
  const orderItems = location.state?.cartItems || [];
  const orderTotal = amount;
  const deliveryFee = 0.0;
  const subtotal = (parseFloat(orderTotal) + deliveryFee).toFixed(2);

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

      // 🟡 CARD PAYMENT FLOW
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
      // 🟢 CASH ON DELIVERY FLOW
      else {
        const orderPayload = buildOrderPayload();
        orderResponse = await axios.post(`${API_URL}/create-order`, orderPayload, {
          withCredentials: true,
        });
        toast.success("Order placed successfully!");
      }

      // 🚚 AUTO-ASSIGN DELIVERY BOY
      if (orderResponse?.data?.orderId) {
        try {
          await axios.post(
            `${API_URL}/auto-assign/${orderResponse.data.orderId}`,
            {},
            { withCredentials: true }
          );
          toast.success("Delivery partner assigned!");
        } catch (err) {
          console.log("Auto-assign error:", err);
          toast.error("Delivery assignment failed");
        }
      }

      // ✅ Redirect to success page
      navigate("/success", { state: { orderId: orderResponse.data.orderId } });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Payment failed");
    } finally {
      setProcessing(false);
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
            {/* 🏠 Address Section */}
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
                      variant={
                        selectedAddress?._id === address._id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedAddress(address)}
                    >
                      {selectedAddress?._id === address._id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* 💳 Payment Section */}
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
                      style: {
                        base: { fontSize: "16px", color: "#424770" },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* 🧾 Order Summary */}
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
      <Footer />
    </>
  );
};

export default PaymentPage;
