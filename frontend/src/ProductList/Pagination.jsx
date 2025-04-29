// Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Previous
        </button>
      )}

      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 border rounded ${
            number === currentPage
              ? 'bg-yellow-500 text-white border-yellow-500'
              : 'hover:bg-gray-100'
          }`}
        >
          {number}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;