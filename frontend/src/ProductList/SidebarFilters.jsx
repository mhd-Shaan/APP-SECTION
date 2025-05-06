import { useState, useEffect } from 'react';
import axios from 'axios';

const SidebarFilters = ({ 
  onFilterChange = () => {},
  isMobileOpen = false,
  onMobileClose = () => {}
}) => {
  const [categories, setCategories] = useState([]);
  const [oemBrands, setOemBrands] = useState([]);
  const [oesBrands, setOesBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showBrands, setShowBrands] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

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

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryChange = (categoryId, isChecked) => {
    const updatedCategories = isChecked 
      ? [...selectedCategories, categoryId] 
      : selectedCategories.filter(id => id !== categoryId);
    
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  const handleBrandChange = (brandName, isChecked) => {
    const updatedBrands = isChecked 
      ? [...selectedBrands, brandName] 
      : selectedBrands.filter(name => name !== brandName);
    
    setSelectedBrands(updatedBrands);
    updateFilters({ brands: updatedBrands });
  };

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

  const updateFilters = (updatedFilters) => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      ...updatedFilters
    });
  };

  if (loading) {
    return (
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] fixed md:sticky top-14 overflow-y-auto z-30">
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

  if (error) {
    return (
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] fixed md:sticky top-14 overflow-y-auto z-30">
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
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={
        `w-64 md:w-56 bg-white p-4 md:p-3 shadow-lg md:shadow-sm 
        h-[calc(100vh-56px)] fixed md:sticky top-14 overflow-y-auto
        transition-all duration-300 ease-in-out z-30
        ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}`
      }>
        {/* Close button for mobile */}
        <button 
          onClick={onMobileClose}
          className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-6">
          {/* Categories Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base md:text-sm">CATEGORIES</h3>
              <button 
                onClick={() => setShowCategories(!showCategories)}
                className="text-sm md:text-xs text-gray-500 hover:text-gray-700"
              >
                {showCategories ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showCategories && (
              categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category._id || category.id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cat-${category._id || category.id}`}
                            className="h-4 w-4 md:h-3.5 md:w-3.5 mr-2"
                            checked={selectedCategories.includes(category._id || category.id)}
                            onChange={(e) => handleCategoryChange(category._id || category.id, e.target.checked)}
                          />
                          <label htmlFor={`cat-${category._id || category.id}`} className="text-base md:text-sm">
                            {category.name}
                          </label>
                        </div>
                        {category.subcategories?.length > 0 && (
                          <button 
                            onClick={() => toggleCategory(category._id || category.id)}
                            className="text-sm md:text-xs text-gray-500"
                          >
                            {expandedCategories[category._id || category.id] ? '−' : '+'}
                          </button>
                        )}
                      </div>

                      {expandedCategories[category._id || category.id] && category.subcategories?.length > 0 && (
                        <div className="pl-6 md:pl-5 mt-1 space-y-2">
                          {category.subcategories.map(subcat => (
                            <div key={subcat._id || subcat.id} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`subcat-${subcat._id || subcat.id}`}
                                className="h-4 w-4 md:h-3.5 md:w-3.5 mr-2"
                                checked={selectedCategories.includes(subcat._id || subcat.id)}
                                onChange={(e) => handleCategoryChange(subcat._id || subcat.id, e.target.checked)}
                              />
                              <label htmlFor={`subcat-${subcat._id || subcat.id}`} className="text-base md:text-sm">
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
                <p className="text-sm md:text-xs text-gray-500">No categories available</p>
              )
            )}
          </div>

          {/* Price Range Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base md:text-sm">PRICE RANGE</h3>
              <button 
                onClick={() => setShowPrice(!showPrice)}
                className="text-sm md:text-xs text-gray-500 hover:text-gray-700"
              >
                {showPrice ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showPrice && (
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 md:p-1 border rounded text-base md:text-sm"
                  value={priceRange.min || ''}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  min="0"
                />
                <span className="text-sm md:text-xs text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 md:p-1 border rounded text-base md:text-sm"
                  value={priceRange.max || ''}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Brands Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base md:text-sm">BRANDS</h3>
              <button 
                onClick={() => setShowBrands(!showBrands)}
                className="text-sm md:text-xs text-gray-500 hover:text-gray-700"
              >
                {showBrands ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showBrands && (
              <>
                {oemBrands.length > 0 && (
                  <div className="mb-5 md:mb-4">
                    <h4 className="font-semibold text-sm md:text-xs mb-2 md:mb-1 text-gray-600">OEM BRANDS</h4>
                    <div className="space-y-2">
                      {oemBrands.map(brand => (
                        <div key={brand.name} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`oem-brand-${brand.name}`}
                            className="h-4 w-4 md:h-3.5 md:w-3.5 mr-2"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                          />
                          <label htmlFor={`oem-brand-${brand.name}`} className="text-base md:text-sm">
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {oesBrands.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm md:text-xs mb-2 md:mb-1 text-gray-600">OES BRANDS</h4>
                    <div className="space-y-2">
                      {oesBrands.map(brand => (
                        <div key={brand.name} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`oes-brand-${brand.name}`}
                            className="h-4 w-4 md:h-3.5 md:w-3.5 mr-2"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                          />
                          <label htmlFor={`oes-brand-${brand.name}`} className="text-base md:text-sm">
                            {brand.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {oemBrands.length === 0 && oesBrands.length === 0 && (
                  <p className="text-sm md:text-xs text-gray-500">No brands available</p>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarFilters;