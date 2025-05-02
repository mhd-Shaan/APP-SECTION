import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Heart, HeartFill } from "react-bootstrap-icons"; // Or any other icon library
import { useNavigate } from "react-router-dom";

const WishlistButton = ({ productId }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate()
  const handleAddToWishlist = async () => {
    try {
      setIsAnimating(true);
      
      await axios.post(
        "http://localhost:5000/addwishlist",
        { productId },
        {withCredentials:true}
      );
      
      setIsInWishlist(true);
      toast.success("Added to wishlist!", {
        icon: '❤️',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
        },
      });
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate('/login')
        console.log(error);
        
      } else {
        toast.error(error?.response?.data?.error || "Failed to add to wishlist");
        console.log(error);
        
      }
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      setIsAnimating(true);
      
      await axios.delete(
        `http://localhost:5000/wishlist/${productId}`,
        { withCredentials: true }
      );
      
      setIsInWishlist(false);
      toast("Removed from wishlist", {
        icon: '♡',
        style: {
          background: '#f3f4f6',
          color: '#4b5563',
        },
      });
    } catch (error) {
      toast.error("Failed to remove from wishlist");
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <button
      onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
      className={`p-2 rounded-full transition-all duration-300 ${
        isInWishlist 
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-gray-400 hover:text-red-400 bg-white hover:bg-gray-50"
      } ${
        isAnimating ? "scale-125" : "scale-100"
      } shadow-sm`}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isInWishlist ? (
        <HeartFill className="w-5 h-5" />
      ) : (
        <Heart className="w-5 h-5" />
      )}
    </button>
  );
};

export default WishlistButton;