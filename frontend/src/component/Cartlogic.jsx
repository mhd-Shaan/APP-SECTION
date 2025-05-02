import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddToCartButton({ productId }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);


  const navigate =useNavigate()
  const handleAddToCart = async () => {
    setLoading(true);
    
    try {
      await axios.post(
        'http://localhost:5000/addcart',
        { productId, quantity: 1 },
        { withCredentials: true }
      );
      setAdded(true);
      
    } catch (error) {
      if(error.response?.status === 401){
        navigate('/login')
        console.log(error);
        
      }else{
        console.log('Error adding to cart:', error);
      }
    } finally {
      
      setLoading(false);
    }
  };

  return (
    <button
      className={`px-4 py-2 rounded ${added ? 'bg-green-500' : "bg-gray-900"} text-white`}
      onClick={handleAddToCart}
      disabled={loading || added}
    >
      {loading ? 'Adding...' : added ? 'Added' : 'Add to Cart'}
    </button>
  );
}

export default AddToCartButton;
