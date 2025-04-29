// SearchResults.jsx
import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductList/ProductCard";

const SearchResults = ({ results, onResultClick }) => {
  if (results.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No products found. Try different keywords.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {results.map((product) => (
        <ProductCard 
          key={product._id} 
          product={product} 
          onClick={onResultClick}
        />
      ))}
    </div>
  );
};

export default SearchResults;