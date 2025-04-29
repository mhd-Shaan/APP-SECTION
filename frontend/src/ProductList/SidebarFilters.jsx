// SidebarFilters.jsx
import React, { useState } from "react";

const SidebarFilters = ({ onFilterChange, currentFilters }) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    const newFilters = { ...localFilters, [name]: checked ? value : '' };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="flex gap-2">
          <input
            type="number"
            name="minPrice"
            placeholder="Min"
            value={localFilters.minPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max"
            value={localFilters.maxPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {['Engine', 'Brake', 'Electrical', 'Suspension'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                name="category"
                value={category}
                checked={localFilters.category === category}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Brands</h3>
        <div className="space-y-2">
          {['Bosch', 'NGK', 'Castrol', 'Mobil'].map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                checked={localFilters.brand === brand}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          const resetFilters = {
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: ''
          };
          setLocalFilters(resetFilters);
          onFilterChange(resetFilters);
        }}
        className="text-yellow-600 hover:text-yellow-700 text-sm"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default SidebarFilters;