import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/orders", {
          withCredentials: true,
        });
        console.log(res.data.orders);
        setOrders(res.data.orders);
      } catch (error) {
        console.log("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <CircularProgress sx={{ color: "#FFC107" }} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10 bg-gray-50 min-h-screen mt-14">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {!Array.isArray(orders) || orders.length === 0 ? (
          <p className="text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card
                key={order._id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <CardContent>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#9e9e9e", fontSize: "0.85rem" }}
                      >
                        ORDER PLACED
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#424242", fontWeight: "500" }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </Typography>
                    </div>

                    <div>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#9e9e9e", fontSize: "0.85rem" }}
                      >
                        ORDER TOTAL
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#424242", fontWeight: "500" }}
                      >
                        ₹{order.itemsPrice?.toFixed(2)}
                      </Typography>
                    </div>

                    <div className="flex items-center gap-2">
                      <Chip
                        label={order.orderStatus}
                        sx={{
                          backgroundColor:
                            order.orderStatus === "Delivered"
                              ? "#4caf50"
                              : order.orderStatus === "Cancelled"
                              ? "#f44336"
                              : "#ff9800",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDialogOpen(true);
                        }}
                        sx={{
                          borderColor: "#1976d2",
                          color: "#1976d2",
                          "&:hover": {
                            borderColor: "#115293",
                            backgroundColor: "#e3f2fd",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>

                  <Divider sx={{ borderColor: "#e0e0e0", mb: 2 }} />

                  <div className="space-y-6">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.product.productId}
                        className="flex flex-col md:flex-row md:items-center gap-4 border-b border-gray-200 pb-4"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.productName}
                          className="w-24 h-24 object-contain border rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#212121",
                              fontWeight: 600,
                              fontSize: "1rem",
                            }}
                          >
                            {item.product.productName}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#757575", mt: 0.5 }}
                          >
                            Price: ₹{item.product.price} × {item.quantity}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#212121", fontWeight: 500, mt: 0.5 }}
                          >
                            Subtotal: ₹
                            {(item.product.price * item.quantity).toFixed(2)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <Typography variant="body2" sx={{ color: "#757575" }}>
                        Payment Method:{" "}
                        <strong>{order.paymentMethod}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            order.paymentStatus === "succeeded"
                              ? "#4caf50"
                              : "#f44336",
                          fontWeight: 600,
                        }}
                      >
                        {order.paymentStatus}
                      </Typography>
                    </div>

                    {order.orderStatus === "Processing" && (
                      <Button variant="contained" color="error" size="small">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />

      {/* ================ DIALOG ================ */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              Order Details
            </DialogTitle>
            <DialogContent dividers sx={{ backgroundColor: "#fafafa" }}>
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                      Order Placed
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "en-IN"
                      )}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                      Order Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedOrder._id}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                      Order Status
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedOrder.orderStatus}
                    </Typography>
                  </div>
                </div>

                <Divider />

                {/* Shipping Address */}
                <div>
                  <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedOrder.shippingAddress?.fullName}<br />
                    {selectedOrder.shippingAddress?.address}<br />
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.state} -{" "}
                    {selectedOrder.shippingAddress?.postalCode}<br />
                    {selectedOrder.shippingAddress?.country}<br />
                    Phone: {selectedOrder.shippingAddress?.phone}
                  </Typography>
                </div>

                <Divider />

                {/* Items */}
                <div className="space-y-4">
                  {selectedOrder.orderItems?.map((item) => (
                    <div
                      key={item.product.productId}
                      className="flex flex-col md:flex-row md:items-center gap-4"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.productName}
                        className="w-24 h-24 object-contain border rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.product.productName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#757575" }}>
                          Price: ₹{item.product.price} × {item.quantity}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Subtotal: ₹
                          {(item.product.price * item.quantity).toFixed(2)}
                        </Typography>
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />

                {/* Payment Info */}
                <div>
                  <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                    Payment Method
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {selectedOrder.paymentMethod}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        selectedOrder.paymentStatus === "succeeded"
                          ? "#4caf50"
                          : "#f44336",
                      fontWeight: 600,
                    }}
                  >
                    {selectedOrder.paymentStatus}
                  </Typography>
                </div>

                <Divider />

                {/* Cost Breakdown */}
                <div className="space-y-2">
                  <Typography variant="subtitle2" sx={{ color: "#9e9e9e" }}>
                    Order Summary
                  </Typography>
                  <div className="flex justify-between">
                    <span>Item(s) Subtotal:</span>
                    <span>₹{selectedOrder.itemsPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee:</span>
                    <span>₹{selectedOrder.shippingPrice?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.codFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cash on Delivery Fee:</span>
                      <span>₹{selectedOrder.codFee?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>₹{selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Promotion Applied:</span>
                      <span>- ₹{selectedOrder.discount?.toFixed(2)}</span>
                    </div>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Grand Total:</span>
                    <span>₹{selectedOrder.totalPrice?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "space-between" }}>
              {selectedOrder.orderStatus === "Processing" && (
                <Button variant="contained" color="error" size="small">
                  Cancel Order
                </Button>
              )}
              <Button
                onClick={() => setDialogOpen(false)}
                variant="outlined"
                sx={{
                  borderColor: "#1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    borderColor: "#115293",
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default UserOrders;
