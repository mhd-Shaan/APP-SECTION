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
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] fixed md:sticky top-14 overflow-y-auto z-40">
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
      <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] fixed md:sticky top-14 overflow-y-auto z-40">
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
      {isMobileOpen && (
        <div 
          className="fixed inset-0  z-30 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside className={`w-62 sm:w-56 lg:w-56 bg-white p-4 md:p-3 shadow-lg md:shadow-sm 
        h-[calc(100vh-45px)] fixed md:sticky top-13 overflow-y-auto
        transition-all duration-300 ease-in-out z-40 
        ${isMobileOpen ? 'left-0' : '-left-full md:left-0'}`}>

        <div className="space-y-6">
          {/* Categories */}
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
                    <div key={category._id}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 mr-2"
                            checked={selectedCategories.includes(category._id)}
                            onChange={(e) => handleCategoryChange(category._id, e.target.checked)}
                          />
                          <label className="text-sm">{category.name}</label>
                        </div>
                        {category.subcategories?.length > 0 && (
                          <button 
                            onClick={() => toggleCategory(category._id)}
                            className="text-xs text-gray-500"
                          >
                            {expandedCategories[category._id] ? '−' : '+'}
                          </button>
                        )}
                      </div>

                      {expandedCategories[category._id] && (
                        <div className="pl-5 mt-1 space-y-1">
                          {category.subcategories.map(subcat => (
                            <div key={subcat._id} className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 mr-2"
                                checked={selectedCategories.includes(subcat._id)}
                                onChange={(e) => handleCategoryChange(subcat._id, e.target.checked)}
                              />
                              <label className="text-sm">{subcat.name}</label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No categories available</p>
              )
            )}
          </div>

          {/* Price */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base md:text-sm">PRICE RANGE</h3>
              <button 
                onClick={() => setShowPrice(!showPrice)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showPrice ? 'Hide' : 'Show'}
              </button>
            </div>
            {showPrice && (
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full p-2 border rounded text-sm"
                  value={priceRange.min || ''}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  min="0"
                />
                <span className="text-sm text-gray-500">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full p-2 border rounded text-sm"
                  value={priceRange.max || ''}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  min="0"
                />
              </div>
            )}
          </div>

          {/* Brands */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-base md:text-sm">BRANDS</h3>
              <button 
                onClick={() => setShowBrands(!showBrands)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showBrands ? 'Hide' : 'Show'}
              </button>
            </div>

            {showBrands && (
              <div className="space-y-2">
                {[{ label: 'OEM Brands', data: oemBrands }, { label: 'OES Brands', data: oesBrands }].map(({ label, data }) => (
                  <div key={label}>
                    <p className="font-medium text-sm text-gray-700 mb-1">{label}</p>
                    {data.length ? (
                      <div className="space-y-1 pl-2">
                        {data.map(brand => (
                          <div key={brand._id} className="flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 mr-2"
                              checked={selectedBrands.includes(brand.name)}
                              onChange={(e) => handleBrandChange(brand.name, e.target.checked)}
                            />
                            <label className="text-sm">{brand.name}</label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 pl-2">No {label.toLowerCase()} available</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SidebarFilters;
