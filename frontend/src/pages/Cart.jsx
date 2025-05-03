import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:5000/viewcart', {
        withCredentials: true,
      });
      
      if (res.data?.cart?.items) {
        const updatedCart = res.data.cart.items.map((item) => ({
          ...item,
          localQuantity: item.quantity,
        }));
        setCart(updatedCart);
      } else {
        throw new Error('Invalid cart data structure');
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setError(error.response?.data?.error || 'Failed to load cart');
      toast.error(error.response?.data?.error || 'Failed to load cart');
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
      toast.error(error.response?.data?.error || 'Failed to remove item');
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    const updatedCart = cart.map((item) =>
      item._id === itemId
        ? { ...item, localQuantity: Math.max(1, item.localQuantity + delta) }
        : item
    );
    
    setCart(updatedCart);

    try {
      const itemToUpdate = cart.find(item => item._id === itemId);
      if (itemToUpdate) {
        const newQuantity = Math.max(1, itemToUpdate.localQuantity + delta);
        await axios.put(
          `http://localhost:5000/updatecart/${itemId}`,
          { quantity: newQuantity },
          { withCredentials: true }
        );
      }
    } catch (error) {
      console.error("Error updating quantity", error);
      toast.error(error.response?.data?.error || 'Failed to update quantity');
      fetchCart();
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    const price = item.priceAtAddTime || item.product?.price || 0;
    return sum + price * item.localQuantity;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow p-4 flex items-center justify-center">
          <div className="text-xl">Loading your cart...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow p-4 flex flex-col items-center justify-center">
          <div className="text-xl text-red-500 mb-4">{error}</div>
          <button 
            onClick={fetchCart}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full pt-20 pb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Shopping Cart</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
            <Link 
              to="/products" 
              className="mt-4 inline-block px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item._id} className="border p-4 rounded-lg flex flex-col md:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product?.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product?.productName || 'Product image'}
                      className="w-24 h-24 object-cover rounded border cursor-pointer"
                      onClick={() => navigate(`/product-details/${item.product?._id}`)}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold hover:text-yellow-600 cursor-pointer"
                            onClick={() => navigate(`/product/${item.product?._id}`)}>
                          {item.product?.productName || 'Product'}
                        </h3>
                        {item.product?.brand?.image && (
                          <img
                            src={item.product.brand.image}
                            alt={item.product.brand.name || "Brand"}
                            className="w-20 h-6 object-contain mt-1"
                          />
                        )}
                        <p className="text-sm text-gray-700 font-medium mt-1">
                          ₹{(item.priceAtAddTime || item.product?.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                          disabled={item.localQuantity <= 1}
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-center">{item.localQuantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="text-lg font-bold">
                  ₹{totalPrice.toLocaleString()}
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <button className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 font-medium">
                  Proceed to Checkout
                </button>
                <Link 
                  to="/products" 
                  className="block w-full py-2 text-center border border-gray-300 rounded hover:bg-gray-50 font-medium text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Cart;