import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

const WishlistButton = ({ productId }) => {
  const handleAddToWishlist = async () => {
    try {
      await axios.post(
        "http://localhost:5000/addwishlist",
        { productId },
        {
          withCredentials: true, 
        }
      );
      toast.success("Added to wishlist!");
    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error("Please log in to add items to your wishlist.");
      } else {
        toast.error(error?.response?.data?.error || "Failed to add to wishlist");
        console.log(error);
        
      }
    }
  };

  return (
    <button
      onClick={handleAddToWishlist}
      className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:text-red-500 transition"
    >
      ♥
    </button>
  );
};

export default WishlistButton;
