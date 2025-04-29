// ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="border rounded-md p-3 shadow-sm hover:shadow-md transition">
      <Link to={`/product/${product._id}`} onClick={onClick}>
        <img 
          src={product.image || '/placeholder-product.png'} 
          alt={product.name} 
          className="h-32 w-full object-contain mb-2" 
        />
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-green-600 font-semibold">₹{product.price}</p>
      </Link>
      <button className="mt-2 text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 w-full">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;