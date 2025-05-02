import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, X, Check } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    showWishlist();
  }, []);

  const showWishlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/viewwishlist', {
        withCredentials: true,
      });
      setWishlistItems(res.data.showproducts?.items || []);
    } catch (error) {
      console.log(error);
      toast.error('Failed to load wishlist');
    }
  };

  const handleDelete = async (wishlistItemId) => {
    try {
      await axios.delete(`http://localhost:5000/deletewishlist/${wishlistItemId}`, {
        withCredentials: true,
      });
      toast.success('Item removed from wishlist');
      showWishlist();
    } catch (error) {
      console.log('Failed to delete item:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = async (productId) => {
    setLoading(true);
    try {
      await axios.post(
        'http://localhost:5000/addcart',
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setAddedItems(prev => ({ ...prev, [productId]: true }));
      toast.success('Added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const addAllToCart = async () => {
    setLoading(true);
    try {
      const inStockItems = wishlistItems.filter(
        item => item.product.stockQuantity > 0
      );
      
      await Promise.all(
        inStockItems.map(item =>
          axios.post(
            'http://localhost:5000/addcart',
            { productId: item.product._id, quantity: 1 },
            { withCredentials: true }
          )
        )
      );

      const addedIds = inStockItems.reduce((acc, item) => {
        acc[item.product._id] = true;
        return acc;
      }, {});
      
      setAddedItems(prev => ({ ...prev, ...addedIds }));
      toast.success(`Added ${inStockItems.length} items to cart`);
    } catch (error) {
      console.error('Error adding items to cart:', error);
      toast.error('Failed to add some items to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-18">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Wishlist</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
          {wishlistItems.length} items
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-gray-400" strokeWidth={1} />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-2 text-gray-500">Start saving your favorite items</p>
          <button className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            Browse Products
          </button>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {wishlistItems.map((item) => (
              <li key={item._id} className="p-4 sm:p-6">
                <div className="flex items-center sm:items-start">
                  <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden">
                    <img
                      src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                      alt={item.product.productName}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col sm:flex-row justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-base font-medium text-gray-900">
                          {item.product.productName}
                        </h4>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ₹{item.product.price}
                      </p>
                      <div className="mt-2 flex items-center">
                        {item.product.stockQuantity > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col space-y-2">
                      <button
                        onClick={() => addToCart(item.product._id)}
                        disabled={
                          loading || 
                          addedItems[item.product._id] || 
                          item.product.stockQuantity <= 0
                        }
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                          addedItems[item.product._id]
                            ? 'bg-green-600 hover:bg-green-700'
                            : item.product.stockQuantity > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {addedItems[item.product._id] ? (
                          <>
                            <Check className="-ml-1 mr-2 h-5 w-5" />
                            Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="-ml-1 mr-2 h-5 w-5" />
                            {item.product.stockQuantity > 0
                              ? loading
                                ? 'Adding...'
                                : 'Add to Cart'
                              : 'Notify Me'}
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              onClick={addAllToCart}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Heart className="-ml-1 mr-2 h-5 w-5" />
              {loading ? 'Adding...' : 'Add All to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>

  );
}

export default Wishlist;