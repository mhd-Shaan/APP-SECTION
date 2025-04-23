import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/viewcart', {
        withCredentials: true,
      });
      
      const updatedCart = res.data.cart.items.map((item) => ({
        ...item,
        localQuantity: item.quantity,
      }));
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/deletecart/${itemId}`, {
        withCredentials: true,
      });
      toast.success('Item removed successfully');
      setCart((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error removing item", error);
      toast.error("Failed to remove item");
    }
  };

  const handleQuantityChange = (itemId, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId
          ? { ...item, localQuantity: Math.max(1, item.localQuantity + delta) }
          : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.priceAtAddTime || item.product?.price || 0;
    return sum + price * item.localQuantity;
  }, 0);

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg flex gap-4 items-start"
            >
              <img
                src={item.product?.images?.[0]}
                alt={item.product?.productName}
                className="w-24 h-24 object-cover rounded border"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">
                  {item.product?.productName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {item.product?.description}
                </p>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  ₹{item.priceAtAddTime || item.product?.price}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantityChange(item._id, -1)}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="min-w-[20px] text-center">{item.localQuantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item._id, 1)}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item._id)}
                className="ml-auto px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right text-xl font-bold mt-6">
            Total: ₹{totalPrice}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
