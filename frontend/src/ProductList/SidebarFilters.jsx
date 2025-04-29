import React from "react";

const SidebarFilters = ({ onFilterChange, currentFilters, onClearFilters }) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 w-full">
      <h2 className="text-lg font-semibold mb-4 border-b pb-2">Filters</h2>
      
      {/* Price Range */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="w-full p-1.5 text-sm border rounded"
            value={currentFilters.minPrice}
            onChange={(e) => onFilterChange({ ...currentFilters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            className="w-full p-1.5 text-sm border rounded"
            value={currentFilters.maxPrice}
            onChange={(e) => onFilterChange({ ...currentFilters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Categories</h3>
        <div className="space-y-1">
          {['Engine', 'Brake', 'Electrical', 'Suspension'].map((category) => (
            <label key={category} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 h-3.5 w-3.5"
                checked={currentFilters.category === category}
                onChange={() => onFilterChange({ 
                  ...currentFilters, 
                  category: currentFilters.category === category ? '' : category 
                })}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-4">
        <h3 className="font-medium text-sm mb-2">Brands</h3>
        <div className="space-y-1">
          {['Bosch', 'NGK', 'Castrol', 'Mobil'].map((brand) => (
            <label key={brand} className="flex items-center text-sm">
              <input
                type="checkbox"
                className="mr-2 h-3.5 w-3.5"
                checked={currentFilters.brand === brand}
                onChange={() => onFilterChange({ 
                  ...currentFilters, 
                  brand: currentFilters.brand === brand ? '' : brand 
                })}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default SidebarFilters;