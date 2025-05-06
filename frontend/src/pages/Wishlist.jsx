import React, { useEffect, useState } from 'react';
import { Heart, ShoppingCart, X, Check, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '@/component/Navbar';
import Footer from '@/component/Footer';
import { Link } from 'react-router-dom';

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedItems, setAddedItems] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      toast.error(error.response?.data?.message || 'Failed to add to cart');
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-4 md:py-8 max-w-7xl mx-auto w-full mt-15">
        <div className="flex items-center justify-between mb-6 md:mb-15">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Your Wishlist
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-pink-100 text-pink-800">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 md:py-16 border-2 border-dashed rounded-lg">
            <Heart className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400" strokeWidth={1} />
            <h3 className="mt-3 md:mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">Start saving your favorite items</p>
            <Link
              to="/products"
              className="mt-4 md:mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <li key={item._id} className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={item.product.images?.[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.productName}
                        className="h-full w-full object-cover object-center"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm md:text-base font-medium text-gray-900 line-clamp-2">
                            {item.product.productName}
                          </h4>
                          <p className="mt-1 text-sm md:text-base font-medium text-gray-900">
                            ₹{item.product.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          aria-label="Remove from wishlist"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      
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

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2 sm:gap-3 sm:w-40">
                      <button
                        onClick={() => addToCart(item.product._id)}
                        disabled={
                          loading || 
                          addedItems[item.product._id] || 
                          item.product.stockQuantity <= 0
                        }
                        className={`flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white ${
                          addedItems[item.product._id]
                            ? 'bg-green-600 hover:bg-green-700'
                            : item.product.stockQuantity > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                      >
                        {addedItems[item.product._id] ? (
                          <>
                            {!isMobile && <Check className="-ml-1 mr-2 h-4 w-4" />}
                            Added
                          </>
                        ) : (
                          <>
                            {!isMobile && <ShoppingCart className="-ml-1 mr-2 h-4 w-4" />}
                            {item.product.stockQuantity > 0
                              ? loading
                                ? 'Adding...'
                                : isMobile ? 'Add' : 'Add to Cart'
                              : 'Notify Me'}
                          </>
                        )}
                      </button>

                      <Link
                        to={`/product-details/${item.product._id}`}
                        className="flex-1 sm:flex-none inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {isMobile ? 'Details' : 'View Details'}
                        {!isMobile && <ChevronRight className="ml-2 h-4 w-4" />}
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Add All Button */}
            {wishlistItems.length > 0 && (
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
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;