import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const API_URL = 'http://localhost:5000';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  const [addresses, setAddresses] = useState(user?.user?.addresses || []);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", mobile: "", pinCode: "", addressLine1: "", addressLine2: "", city: ""
  });

  const amount = location.state?.amount || 0;
  const orderItems = location.state?.cartItems || [];
  const orderTotal = amount;
  const deliveryFee = 0.00;
  const subtotal = (parseFloat(orderTotal) + deliveryFee).toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAddressForm = () => {
    const { fullName, mobile, pinCode, addressLine1, addressLine2, city } = formData;
    if (!fullName || !mobile || !pinCode || !addressLine1 || !addressLine2 || !city) {
      toast.error("All fields are required");
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Enter valid 10-digit mobile number");
      return false;
    }
    if (!/^\d{6}$/.test(pinCode)) {
      toast.error("Enter valid 6-digit PIN code");
      return false;
    }
    return true;
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!validateAddressForm()) return;

    const addressData = {
      fullName: formData.fullName,
      phone: formData.mobile,
      pincode: formData.pinCode,
      houseNumber: formData.addressLine1,
      address: formData.addressLine2,
      city: formData.city
    };

    try {
      if (isEditingAddress && selectedAddress) {
        const res = await axios.put(`${API_URL}/updateaddress/${selectedAddress._id}`, addressData, { withCredentials: true });
        setAddresses(addresses.map(addr => addr._id === selectedAddress._id ? res.data.address : addr));
        setSelectedAddress(res.data.address);
        toast.success("Address updated");
      } else {
        const res = await axios.post(`${API_URL}/addaddress`, addressData, { withCredentials: true });
        setAddresses([...addresses, res.data.address]);
        setSelectedAddress(res.data.address);
        toast.success("Address added");
      }
      setIsAddressDialogOpen(false);
      setIsEditingAddress(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axios.delete(`${API_URL}/deleteaddress/${id}`, { withCredentials: true });
      const updated = addresses.filter(a => a._id !== id);
      setAddresses(updated);
      if (selectedAddress?._id === id) setSelectedAddress(updated[0] || null);
      toast.success("Address deleted");
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast.error("Select a delivery address");
      return;
    }

    setProcessing(true);

    try {
      let paymentIntentResponse = null;

      if (paymentMethod === "card") {
        // Create payment intent on demand
        paymentIntentResponse = await axios.post(`${API_URL}/create-payment-intent`, {
          totalPrice: amount,
        }, {
          withCredentials: true
        });

        setClientSecret(paymentIntentResponse.data.clientSecret);

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
          // Save order after payment success
          const orderPayload = buildOrderPayload(paymentIntent);
          const res = await axios.post(`${API_URL}/create-order`, orderPayload, { withCredentials: true });
          toast.success("Payment successful!");
          navigate("/success", { state: { orderId: res.data.orderId } });
          return;
        } else {
          throw new Error("Payment was not successful.");
        }
      }

      // COD logic
      const orderPayload = buildOrderPayload();
      const res = await axios.post(`${API_URL}/create-order`, orderPayload, { withCredentials: true });
      toast.success("Order placed!");
      navigate("/success", { state: { orderId: res.data.orderId } });

    } catch (err) {
      console.error(err);
      toast.error(err.error || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const buildOrderPayload = (paymentIntent = null) => ({
    orderItems: orderItems.map(item => ({
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
            {/* Address Section */}
            <div className="space-y-3">
              <h3 className="font-medium">Delivery Address</h3>
              {addresses.length > 0 ? (
                addresses.map(address => (
                  <div key={address._id} className={`border rounded p-3 ${selectedAddress?._id === address._id ? 'border-blue-500' : ''}`}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{address.fullName}</p>
                        <p className="text-sm">{address.houseNumber}, {address.address}, {address.city} - {address.pincode}</p>
                        <p className="text-sm">Phone: {address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => {
                          setIsEditingAddress(true);
                          setSelectedAddress(address);
                          setFormData({
                            fullName: address.fullName,
                            mobile: address.phone,
                            pinCode: address.pincode,
                            addressLine1: address.houseNumber,
                            addressLine2: address.address,
                            city: address.city
                          });
                          setIsAddressDialogOpen(true);
                        }}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteAddress(address._id)}>Delete</Button>
                      </div>
                    </div>
                    <Button
                      variant={selectedAddress?._id === address._id ? "default" : "outline"}
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setSelectedAddress(address)}
                    >
                      {selectedAddress?._id === address._id ? "Selected" : "Select"}
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No addresses saved</p>
              )}
              <Button variant="outline" className="w-full" onClick={() => {
                setIsEditingAddress(false);
                setFormData({ fullName: "", mobile: "", pinCode: "", addressLine1: "", addressLine2: "", city: "" });
                setIsAddressDialogOpen(true);
              }}>Add New Address</Button>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h3 className="font-medium">Payment Method</h3>
              <div className="flex gap-4">
                <Button variant={paymentMethod === "card" ? "default" : "outline"} onClick={() => setPaymentMethod("card")}>Card</Button>
                <Button variant={paymentMethod === "cod" ? "default" : "outline"} onClick={() => setPaymentMethod("cod")}>Cash on Delivery</Button>
              </div>
              {paymentMethod === "card" && (
                <div className="border rounded p-3">
                  <CardElement options={{ style: { base: { fontSize: '16px', color: '#424770' } } }} />
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              <div className="flex justify-between"><span>Items</span><span>₹{orderTotal}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>₹{deliveryFee.toFixed(2)}</span></div>
              <Separator />
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{subtotal}</span></div>
            </div>

            <Button className="w-full bg-yellow-500 text-white rounded hover:bg-yellow-600" onClick={handleSubmit} disabled={processing || !selectedAddress}>
              {processing ? "Processing..." : `Place Order - ₹${subtotal}`}
            </Button>
          </CardContent>
        </Card>

        {/* Address Dialog */}
        <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingAddress ? "Edit" : "Add"} Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddressSubmit} className="space-y-3">
              <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
              <Input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} required />
              <Input name="pinCode" placeholder="PIN Code" value={formData.pinCode} onChange={handleInputChange} required />
              <Input name="addressLine1" placeholder="House No., Building" value={formData.addressLine1} onChange={handleInputChange} required />
              <Input name="addressLine2" placeholder="Street, Area" value={formData.addressLine2} onChange={handleInputChange} required />
              <Input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
              <Button type="submit" className="w-full" disabled={processing}>{isEditingAddress ? "Update" : "Save"} Address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
