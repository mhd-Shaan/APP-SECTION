// src/components/ProductGrid.jsx

import React from "react";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";

const ProductGrid = ({
  products,
  loading,
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
  searchQuery,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <p className="text-gray-600">No products found matching your search.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
        </h1>
        <p className="text-gray-600">
          Showing {products.length} of {totalResults} results
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default ProductGrid;
