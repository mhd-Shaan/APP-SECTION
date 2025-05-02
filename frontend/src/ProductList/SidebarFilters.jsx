import { useState, useEffect } from 'react';
import axios from 'axios';

const SidebarFilters = ({ onFilterChange = () => {} }) => {
  // Initialize all states with proper default values
  const [categories, setCategories] = useState([]);
  const [oemBrands, setOemBrands] = useState([]);
  const [oesBrands, setOesBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  
  // Toggle states for sections
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch categories and brands from backend with proper error handling
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get('http://localhost:5000/category'),
          axios.get('http://localhost:5000/brands')
        ]);
        
        setCategories(categoriesRes?.data.category || []);
        setOemBrands(brandsRes?.data?.oem || []);
        setOesBrands(brandsRes?.data?.oes || []);
        
      } catch (err) {
        console.error('Failed to fetch filters:', err);
        setError('Failed to load filters. Please try again later.');
        setCategories([]);
        setOemBrands([]);
        setOesBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId, isChecked) => {
    const updatedCategories = isChecked 
      ? [...selectedCategories, categoryId] 
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  // Handle brand selection
  const handleBrandChange = (brandId, isChecked) => {
    const updatedBrands = isChecked 
      ? [...selectedBrands, brandId] 
      : selectedBrands.filter(id => id !== brandId);
    
    setSelectedBrands(updatedBrands);
    updateFilters({ brands: updatedBrands });
  };

  // Handle price range change
  const handlePriceChange = (e, type) => {
    const value = e.target.value;
    const updatedPriceRange = {
      ...priceRange,
      [type]: value ? parseInt(value) || 0 : ''
    };
    
    setPriceRange(updatedPriceRange);
    updateFilters({ 
      minPrice: updatedPriceRange.min,
      maxPrice: updatedPriceRange.max
    });
  };

  // Update filters and notify parent
  const updateFilters = (updatedFilters) => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      ...updatedFilters
    });
  };

  // Loading state
  if (loading) {
    return (
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
        <div className="space-y-5">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-3 bg-gray-100 rounded w-full"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    );
  }

  // Error state
  if (error) {
    return (
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
        <div className="text-red-500 text-sm mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 hover:underline"
        >
          Retry
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
      <div className="space-y-5">
        {/* Categories Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">CATEGORIES</h3>
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showCategories ? 'Hide' : 'View'}
            </button>
          </div>
          
          {showCategories && (
            categories.length > 0 ? (
              <div className="space-y-1">
                {categories.map(category => (
                  <div key={category._id || category.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`cat-${category._id || category.id}`}
                          className="h-3.5 w-3.5 mr-2"
                          checked={selectedCategories.includes(category._id || category.id)}
                          onChange={(e) => handleCategoryChange(category._id || category.id, e.target.checked)}
                        />
                        <label htmlFor={`cat-${category._id || category.id}`} className="text-sm">
                          {category.name}
                        </label>
                      </div>
                      {category.subcategories?.length > 0 && (
                        <button 
                          onClick={() => toggleCategory(category._id || category.id)}
                          className="text-xs text-gray-500"
                          aria-label={expandedCategories[category._id || category.id] ? 'Collapse' : 'Expand'}
                        >
                          {expandedCategories[category._id || category.id] ? '−' : '+'}
                        </button>
                      )}
                    </div>

                    {expandedCategories[category._id || category.id] && category.subcategories?.length > 0 && (
                      <div className="pl-5 mt-1 space-y-1">
                        {category.subcategories.map(subcat => (
                          <div key={subcat._id || subcat.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`subcat-${subcat._id || subcat.id}`}
                              className="h-3.5 w-3.5 mr-2"
                              checked={selectedCategories.includes(subcat._id || subcat.id)}
                              onChange={(e) => handleCategoryChange(subcat._id || subcat.id, e.target.checked)}
                            />
                            <label htmlFor={`subcat-${subcat._id || subcat.id}`} className="text-sm">
                              {subcat.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">No categories available</p>
            )
          )}
        </div>

        {/* Price Range Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">PRICE RANGE</h3>
            <button 
              onClick={() => setShowPrice(!showPrice)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showPrice ? 'Hide' : 'View'}
            </button>
          </div>
          
          {showPrice && (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full p-1 border rounded text-sm"
                value={priceRange.min || ''}
                onChange={(e) => handlePriceChange(e, 'min')}
                min="0"
              />
              <span className="text-xs text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="w-full p-1 border rounded text-sm"
                value={priceRange.max || ''}
                onChange={(e) => handlePriceChange(e, 'max')}
                min="0"
              />
            </div>
          )}
        </div>

        {/* Brands Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm">BRANDS</h3>
            <button 
              onClick={() => setShowBrands(!showBrands)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showBrands ? 'Hide' : 'View'}
            </button>
          </div>
          
          {showBrands && (
            <>
              {oemBrands.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-xs mb-1 text-gray-600">OEM BRANDS</h4>
                  <div className="space-y-1">
                    {oemBrands.map(brand => (
                      <div key={brand._id || brand.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`oem-brand-${brand._id || brand.id}`}
                          className="h-3.5 w-3.5 mr-2"
                          checked={selectedBrands.includes(brand._id || brand.id)}
                          onChange={(e) => handleBrandChange(brand._id || brand.id, e.target.checked)}
                        />
                        <label htmlFor={`oem-brand-${brand._id || brand.id}`} className="text-sm">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OES Brands Subsection */}
              {oesBrands.length > 0 && (
                <div>
                  <h4 className="font-semibold text-xs mb-1 text-gray-600">OES BRANDS</h4>
                  <div className="space-y-1">
                    {oesBrands.map(brand => (
                      <div key={brand._id || brand.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`oes-brand-${brand._id || brand.id}`}
                          className="h-3.5 w-3.5 mr-2"
                          checked={selectedBrands.includes(brand._id || brand.id)}
                          onChange={(e) => handleBrandChange(brand._id || brand.id, e.target.checked)}
                        />
                        <label htmlFor={`oes-brand-${brand._id || brand.id}`} className="text-sm">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No brands message */}
              {oemBrands.length === 0 && oesBrands.length === 0 && (
                <p className="text-xs text-gray-500">No brands available</p>
              )}
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;