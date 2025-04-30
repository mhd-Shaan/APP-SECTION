const SidebarFilters = () => {
  return (
    <aside className="w-56 bg-white p-3 shadow-sm h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
      <div className="space-y-5">
        {/* Categories */}
        <div>
          <h3 className="font-bold text-sm mb-2">CATEGORIES</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <input type="checkbox" id="mobiles" className="h-3.5 w-3.5 mr-2" />
              <label htmlFor="mobiles" className="text-sm">Mobiles & Accessories</label>
            </div>
            <div className="pl-5">
              <div className="flex items-center">
                <input type="checkbox" id="mobile-phones" className="h-3.5 w-3.5 mr-2" />
                <label htmlFor="mobile-phones" className="text-sm">Mobiles</label>
              </div>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-bold text-sm mb-2">PRICE</h3>
          <div className="flex items-center justify-between text-xs">
            <span>Min</span>
            <span>to</span>
            <span>$30000+</span>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-bold text-sm mb-2">BRAND</h3>
          <div className="space-y-1">
            {['Apple', 'SAMSUNG', 'MOTOROLA', 'Infinix', 'BDOQ'].map(brand => (
              <div key={brand} className="flex items-center">
                <input type="checkbox" id={brand} className="h-3.5 w-3.5 mr-2" />
                <label htmlFor={brand} className="text-sm">{brand}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;